import HomeBannerStyle from "@/common/assets/svgs/HomeBannerBackground";

const Header = ({ edit }: { edit?: boolean }) => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-[12px] border border-[#f8d3b0] p-[48px_20px] text-left md:p-[64px_40px] md:text-center"
      style={{
        ...HomeBannerStyle,
      }}
    >
      <h3 className="font-lora text-[32px] leading-[120%] tracking-[-0.8px] md:text-[40px]">
        {edit ? "Edit" : "Register New"} Project
      </h3>
      <h4 className="max-w-[600px] text-[16px] leading-[155%] md:text-[18px]">
        Create a profile for your project to receive donations and qualify for
        funding rounds.
      </h4>
    </div>
  );
};

export default Header;
