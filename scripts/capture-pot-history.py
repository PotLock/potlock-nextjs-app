"""Capture public, read-only Pot history at one finalized mainnet block."""
import base64
import collections
import concurrent.futures
import datetime
import json
import pathlib
import urllib.request

RPC = "https://rpc.mainnet.fastnear.com"
FACTORY = "v1.potfactory.potlock.near"
ROOT = pathlib.Path(__file__).resolve().parents[1]


def aggregate_history(detail):
    """Publish aggregate metrics, never donor/applicant/recipient identities."""
    def month(timestamp):
        return datetime.datetime.fromtimestamp(timestamp / 1000, datetime.timezone.utc).strftime("%Y-%m")

    def donation_months(matching):
        groups = {}
        for donation in detail["donations"]:
            if donation["matching_pool"] != matching:
                continue
            key = month(donation["donated_at"])
            group = groups.setdefault(key, {"count": 0, "donors": set(), "gross": 0, "net": 0})
            group["count"] += 1
            group["donors"].add(donation["donor_id"])
            group["gross"] += int(donation["total_amount"])
            group["net"] += int(donation["net_amount"])
        return [{"month": key, "count": value["count"], "uniqueDonors": len(value["donors"]), "gross": str(value["gross"]), "net": str(value["net"])} for key, value in sorted(groups.items(), reverse=True)]

    statuses = collections.Counter(a["status"] for a in detail["applications"])
    application_months = collections.Counter((month(a["submitted_at"]), a["status"]) for a in detail["applications"])
    payout_months = {}
    for payout in detail["payouts"]:
        key = month(payout["paid_at"]) if payout["paid_at"] is not None else "Not marked paid"
        group = payout_months.setdefault(key, {"count": 0, "amount": 0})
        group["count"] += 1
        group["amount"] += int(payout["amount"])
    config = detail["config"]
    allowed_config = ("pot_name", "pot_description", "base_currency", "application_start_ms", "application_end_ms", "public_round_start_ms", "public_round_end_ms", "cooldown_end_ms", "max_projects", "all_paid_out", "chef_fee_basis_points", "referral_fee_matching_pool_basis_points", "referral_fee_public_round_basis_points")
    return {
        "account": detail["account"], "capturedAt": detail["capturedAt"], "blockHeight": detail["blockHeight"],
        "config": {**{key: config[key] for key in allowed_config}, "admin_count": len(config["admins"]), "chef_assigned": config["chef"] is not None},
        "metrics": detail["metrics"],
        "donationMonths": donation_months(False), "sponsorshipMonths": donation_months(True),
        "applicationStatuses": [{"status": status, "count": count} for status, count in sorted(statuses.items())],
        "applicationMonths": [{"month": key[0], "status": key[1], "count": count} for key, count in sorted(application_months.items(), reverse=True)],
        "payoutMonths": [{"month": key, "count": value["count"], "amount": str(value["amount"])} for key, value in sorted(payout_months.items(), reverse=True)],
    }


def view(account, method, args=None, block=None):
    params = {
        "request_type": "call_function", "account_id": account,
        "method_name": method,
        "args_base64": base64.b64encode(json.dumps(args or {}).encode()).decode(),
        **({"block_id": block} if block else {"finality": "final"}),
    }
    request = urllib.request.Request(
        RPC, data=json.dumps({"jsonrpc": "2.0", "id": "history", "method": "query", "params": params}).encode(),
        headers={"Content-Type": "application/json"},
    )
    last_error = None
    for _ in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                result = json.load(response)
            if "error" in result or "error" in result.get("result", {}):
                raise RuntimeError(str(result))
            query = result["result"]
            return json.loads(bytes(query["result"]).decode()), query["block_height"]
        except Exception as error:
            last_error = error
    raise RuntimeError(f"{account}/{method}: {last_error}")


def pages(account, method, block):
    records = []
    for offset in range(0, 20000, 200):
        batch, _ = view(account, method, {"from_index": offset, "limit": 200}, block)
        records.extend(batch)
        if len(batch) < 200:
            return records
    raise RuntimeError(f"{account}/{method}: pagination limit reached; refusing partial capture")


def capture():
    pots, block = view(FACTORY, "get_pots")
    captured_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    def read(pot):
        account = pot["id"]
        config, _ = view(account, "get_config", block=block)
        donations = pages(account, "get_donations", block)
        applications = pages(account, "get_applications", block)
        assert len({d["id"] for d in donations}) == len(donations), "Duplicate donation IDs"
        assert sum(not d["matching_pool"] for d in donations) == config["public_donations_count"], "Incomplete public donations"
        metrics = {
            "matchingPoolBalance": config["matching_pool_balance"],
            "publicDonationsNet": config["total_public_donations"],
            "donationsGross": str(sum(int(d["total_amount"]) for d in donations)),
            "donationCount": len(donations),
            "publicDonationCount": config["public_donations_count"],
            "matchingDonationCount": sum(d["matching_pool"] for d in donations),
            "uniqueDonors": len({d["donor_id"] for d in donations}),
            "uniqueSponsors": len({d["donor_id"] for d in donations if d["matching_pool"]}),
            "applicants": len(applications),
            "approvedProjects": sum(a["status"] == "Approved" for a in applications),
            "payoutsAllocated": str(sum(int(p["amount"]) for p in config["payouts"])),
            "payoutsPaid": str(sum(int(p["amount"]) for p in config["payouts"] if p["paid_at"] is not None)),
            "payoutCount": len(config["payouts"]),
            "paidPayoutCount": sum(p["paid_at"] is not None for p in config["payouts"]),
        }
        summary = {
            "account": account, "name": config["pot_name"], "description": config["pot_description"].strip(),
            "matching_round_end": datetime.datetime.fromtimestamp(config["public_round_end_ms"] / 1000, datetime.timezone.utc).isoformat(),
            "blockHeight": block, "metrics": metrics,
        }
        # Keep public account IDs, status and dates; omit free-text messages and review notes.
        detail = {
            "account": account, "capturedAt": captured_at, "blockHeight": block,
            "config": {k: v for k, v in config.items() if k not in ("custom_sybil_checks", "custom_min_threshold_score", "payouts")},
            "metrics": metrics, "payouts": config["payouts"],
            "applications": [{k: a[k] for k in ("project_id", "status", "submitted_at", "updated_at")} for a in applications],
            "donations": [{k: d[k] for k in ("id", "donor_id", "project_id", "matching_pool", "total_amount", "net_amount", "donated_at")} for d in donations],
        }
        return summary, detail

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(read, pots))
    # Write only after every account has been captured and checked successfully.
    destination = ROOT / "public" / "pot-history"
    destination.mkdir(exist_ok=True)
    for summary, detail in results:
        (destination / f"{summary['account']}.json").write_text(json.dumps(aggregate_history(detail), indent=2) + "\n")
    manifest = {"network": "mainnet", "capturedAt": captured_at, "factoryAccount": FACTORY, "records": [r[0] for r in results]}
    (ROOT / "src/features/pot-maintenance/historical-pots.snapshot.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"blockHeight": block, "pots": len(results), "donations": sum(r[0]["metrics"]["donationCount"] for r in results), "applications": sum(r[0]["metrics"]["applicants"] for r in results)}))


if __name__ == "__main__":
    capture()
