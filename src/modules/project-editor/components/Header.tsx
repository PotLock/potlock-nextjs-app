import HomeBannerStyle from "@/common/assets/svgs/HomeBannerBackground";

const Header = ({ edit }: { edit?: boolean }) => {
  return (
    <div
      className="md:p-[64px_40px] md:text-center flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-[12px] border border-[#f8d3b0] p-[48px_20px] text-left"
      style={{
        ...HomeBannerStyle,
      }}
    >
      <h3 className="md:text-[40px] font-lora text-[32px] leading-[120%] tracking-[-0.8px]">
        {edit ? "Edit" : "Register New"} Project
      </h3>
      <h4 className="md:text-[18px] max-w-[600px] text-[16px] leading-[155%]">
        Create a profile for your project to receive donations and qualify for
        funding rounds.
      </h4>
    </div>
  );
};

export default Header;
