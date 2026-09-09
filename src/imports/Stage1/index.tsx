function PillButtonPrimary({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#101014] h-[56px] relative rounded-[999px] w-[345px]"} data-name="Pill Button / Primary">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] relative size-full">
          <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
            <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-white whitespace-nowrap">
              <p className="leading-[18px]">Rest my eyes now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[34px] text-white tracking-[-1px] w-full">
        <p className="leading-[36px] mb-0">Twelve minutes at</p>
        <p className="leading-[36px] mb-0">{`arm's length.`}</p>
        <p className="leading-[36px]">Eight to go.</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[11px] text-white tracking-[0.6px] uppercase w-full">
        <p className="leading-[14px]">NEXT LOOK-AWAY</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Source_Code_Pro:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[56px] text-white tracking-[-2px] w-full">
        <p className="leading-[56px]">07:41</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,255,255,0.25)] content-stretch flex h-[3px] items-start relative shrink-0 w-[345px]" data-name="Overlay">
      <div className="bg-white h-[3px] relative shrink-0 w-[205px]" data-name="Background" />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Source_Code_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-[rgba(255,255,255,0.75)] w-full">
        <p className="leading-[16px]">BLOCK 12 OF 18</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
      <Overlay />
      <Container5 />
    </div>
  );
}

function Spacer() {
  return <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Spacer" />;
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[24px] relative w-full" data-name="Container">
      <Container1 />
      <Container2 />
      <Spacer />
      <PillButtonPrimary className="bg-[#101014] h-[56px] relative rounded-[999px] shrink-0 w-full" />
    </div>
  );
}

export default function Stage() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" style={{ backgroundImage: "linear-gradient(180deg, rgb(6, 55, 95) 0%, rgb(11, 79, 143) 35.211%, rgb(143, 178, 122) 75.117%, rgb(221, 232, 206) 100%)" }} data-name="stage_1">
      <Container />
    </div>
  );
}