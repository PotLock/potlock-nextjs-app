import { Form } from "react-hook-form";

import { Pot } from "@/common/api/indexer";
import { Challenge } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Textarea,
} from "@/common/ui/components";
import Spinner from "@/common/ui/components/Spinner";
import { useTypedSelector } from "@/store";

import { useChallengeForm } from "../hooks";

type Props = {
  potDetail: Pot;
  open?: boolean;
  onCloseClick?: () => void;
  previousChallenge?: Challenge;
};

const ChallengeModal = ({
  open,
  onCloseClick,
  potDetail,
  previousChallenge,
}: Props) => {
  const { actAsDao, accountId } = useTypedSelector((state) => state.nav);

  // AccountID (Address)
  const asDao = actAsDao.toggle && !!actAsDao.defaultAddress;

  // Form settings
  const { form, errors, onSubmit, inProgress } = useChallengeForm({
    accountId: asDao ? actAsDao.defaultAddress : accountId,
    asDao,
    potDetail,
  });

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>Challenge Payouts</DialogTitle>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <div className="flex flex-col p-6">
            {/*NEAR Input */}
            <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-[#525252]">
              Explain the reason for your challenge{" "}
              <span style={{ color: "#DD3345" }}>*</span>
            </p>

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  placeholder="Type the reason for your challenge here"
                  rows={5}
                  className="mt-2"
                  {...field}
                  defaultValue={
                    previousChallenge ? previousChallenge.reason : ""
                  }
                  error={errors.message?.message}
                />
              )}
            />

            <Button
              disabled={!form.formState.isValid || inProgress}
              className="mt-6 min-w-[200px] self-end"
              type="submit"
            >
              {inProgress ? <Spinner /> : <>Submit Challenge</>}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeModal;
