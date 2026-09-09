function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[11px] text-white tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[14px]">LOOK AWAY</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Source_Code_Pro:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[128px] text-white tracking-[-6px] whitespace-nowrap">
        <p className="leading-[118px]">20</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[11px] text-white tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[14px]">SECONDS</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[8px] items-center left-[calc(50%+0.5px)] px-[24px] top-[221px]" data-name="Container">
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function HorizontalDivider() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(16,16,20,0.15)] content-stretch flex h-[2px] items-start left-1/2 top-[393px] w-[393px]" data-name="Horizontal Divider">
      <div className="bg-white h-[2px] relative shrink-0 w-[78px]" data-name="Horizontal Divider" />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-center px-[0.45px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px] mb-0">Find something at least six</p>
        <p className="leading-[24px] mb-0">metres out. A window, a</p>
        <p className="leading-[24px]">doorway, the far end of the room.</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-white h-[20px] relative shrink-0 w-px" data-name="Vertical Divider" />
      <div className="bg-white flex-[1_0_0] h-px min-w-px relative" data-name="Horizontal Divider" />
      <div className="bg-white h-[20px] relative shrink-0 w-px" data-name="Vertical Divider" />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[11px] text-white tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[14px]">6 M</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[11px] text-white tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[14px]">20 FT</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[345px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container5() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[32px] items-center left-[calc(50%+0.45px)] pt-[32px] px-[24px] top-[395px]" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-white whitespace-nowrap">
        <p className="leading-[18px]">Skip this one</p>
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="-translate-x-1/2 absolute border border-solid border-white content-stretch flex h-[48px] items-center justify-center left-1/2 rounded-[999px] top-[780px] w-[345px]" data-name="Border">
      <Container12 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <Container1 />
      <HorizontalDivider />
      <Container5 />
      <Border />
    </div>
  );
}

export default function Stage() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-col from-[#93d3b9] items-start justify-center relative size-full to-[#2f6b4a]" data-name="stage_5">
      <Container />
    </div>
  );
}