"use client";

import { useEffect, useState } from "react";

import routesPath from "@app/routes/routesPath";

// import {
//   Banner,
//   BannerAlertSvg,
//   BannerLinkContainer,
//   BannerLinkSvg,
//   BannerText,
//   NavContainer,
//   NavLeft,
//   NavLogo,
//   NavMenu,
//   NavMenuItem,
//   NavRight,
//   NavRightMobile,
//   NavTab,
//   NavTabs,
// } from "./styles";

const Nav = () => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  console.log(location.pathname);

  const tabOptions = [
    {
      href: null,
      newTab: null,
      text: "Projects",
      link: "projects",
      disabled: false,
    },
    { href: null, newTab: null, text: "Feed", link: "feed", disabled: false },
    {
      href: null,
      newTab: null,
      text: "Pots",
      link: "pots",
      disabled: false,
    },
    {
      href: null,
      newTab: null,
      text: "Donors",
      link: "donors",
      disabled: false,
    },
  ];

  return (
    <nav className="p-[0 40px] md:p-[24px 8px 24px 0] container z-50 flex h-[110px] items-center justify-start self-stretch bg-white md:h-[96px]">
      <p>Oi</p>
    </nav>
  );

  // return (
  //   <>
  //     <NavContainer>
  //       <NavLeft>
  //         <NavLogo>
  //           <RouteLink to={routesPath.PROJECTS_LIST_TAB}>
  //             <>
  //               <img
  //                 src="https://ipfs.near.social/ipfs/bafkreiafms2jag3gjbypfceafz2uvs66o25qc7m6u6hkxfyrzfoeyvj7ru"
  //                 alt="logo"
  //               />
  //               POTLOCK
  //             </>
  //           </RouteLink>
  //         </NavLogo>
  //       </NavLeft>
  //       <NavRight>
  //         <NavTabs>
  //           {(tabOptions ?? []).map((tab) => {
  //             return (
  //               <NavTab
  //                 disabled={tab.disabled}
  //                 selected={tab.link === params.tab}
  //               >
  //                 <RouteLink
  //                   href={tab.href}
  //                   to={tab.link}
  //                   target={tab.newTab ? "_blank" : ""}
  //                   onClick={(e: any) => {
  //                     if (tab.disabled) e.preventDefault();
  //                   }}
  //                 >
  //                   {tab.text}
  //                 </RouteLink>
  //               </NavTab>
  //             );
  //           })}
  //           <NavItem />
  //         </NavTabs>
  //       </NavRight>
  //       <NavRightMobile>
  //         <NavItem />
  //         <NavTab onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}>
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             width="24"
  //             height="24"
  //             viewBox="0 0 24 24"
  //             fill="none"
  //           >
  //             <path
  //               d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
  //               fill="#7B7B7B"
  //             />
  //           </svg>
  //         </NavTab>
  //       </NavRightMobile>
  //     </NavContainer>

  //     {isNavMenuOpen && (
  //       <NavMenu>
  //         {tabOptions.map((tab) => {
  //           return (
  //             <NavMenuItem
  //               href={hrefWithParams(`?tab=${tab.link}`)}
  //               // disabled={tab.disabled}
  //               onClick={(e) => {
  //                 if (tab.disabled) e.preventDefault();
  //               }}
  //               selected={props.tab === tab.link}
  //             >
  //               {tab.text}
  //               {tab.disabled && " (Coming Soon)"}
  //             </NavMenuItem>
  //           );
  //         })}
  //       </NavMenu>
  //     )}
  //   </>
  // );
};

export default Nav;
