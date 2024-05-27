import { useTypedSelector } from "@app/store";

import { Button } from "../core/common/button";

const Hero = () => {
  const { name } = useTypedSelector((state) => state.auth);
  console.log("name", name);

  return (
    <div className="bg-hero relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-solid border-[#f8d3b0] bg-cover bg-no-repeat">
      <div className="content">
        <h3 className="sub-title">Transforming Funding for Public Goods</h3>
        <h1 className="title">
          Discover impact projects, donate directly, &
          <br className="line-break" /> participate in funding rounds.
        </h1>
        <div className="btns">
          <Button
          //   onClick={openDonateRandomlyModal}
          >
            Donate Randomly
          </Button>

          <Button
            variant={"brand-tonal"}
            // href={
            //   isRegisteredProject
            //     ? `?tab=project&projectId=${accountId}`
            //     : "?tab=createproject"
            // }
          >
            {/* {isRegisteredProject
              ? "View Your Project"
              : "Register Your Project"} */}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
