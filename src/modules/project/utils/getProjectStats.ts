export const getProjectStats = async () => {
  let stats = { total_payouts_usd: 194787, total_donors_count: 2018 }; // Default values
  let registrations = { count: 250 }; // Default values

  try {
    const [statsResponse, registrationsResponse] = await Promise.all([
      fetch("https://dev.potlock.io/api/v1/stats", {
        next: { revalidate: 3600 },
      }),
      fetch("https://dev.potlock.io/api/v1/lists/1/registrations", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }
    if (registrationsResponse.ok) {
      registrations = await registrationsResponse.json();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const data = { stats, registrations };

  return data;
};
