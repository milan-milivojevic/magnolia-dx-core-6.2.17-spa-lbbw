import React, { useState, useEffect } from 'react';
import PageLoader from './helpers/PageLoader';
import Navigation from './components/navigation/Navigation';
import HeadlinesStyles from './styles/headlines';
import ParagraphsStyles from './styles/paragraphs';
import PagesStyles from './styles/pages';
import HeaderStyles from './styles/header';
import NavLevelsStyles from './styles/navLevels';
import TopNavStyles from './styles/topNavigation';
import LeftNavStyles from './styles/leftNavigation';
import './App.css';
import { IoLogOutOutline, IoSearchOutline } from 'react-icons/io5';
import { CiGrid41 } from "react-icons/ci";
import { ReactComponent as SettingsIcon } from './images/home/SettingsIcon.svg';
import { ReactComponent as SearchIcon } from './images/home/SearchIcon.svg';
import { GrUserAdmin, GrUserSettings, GrSearch, GrLogout, GrLanguage, GrFormDown, GrFormUp } from "react-icons/gr";
import ClipLoader from "react-spinners/ClipLoader";
import {
  isPublicInstance,
  getAPIBase,
  getLanguages,
  getCurrentLanguage,
  changeLanguage,
  getRouterBasename, 
  events
} from "./helpers/AppHelpers";
import { useScrollTrigger } from '@mui/material';

const ForwardedTopNav = React.forwardRef(Navigation);

function App() {

  useEffect(() => {
    const handleLinkClick = (event) => {
      let target = event.target;
      while (target && target !== document) {
        if (target.tagName === 'A') break;
        target = target.parentNode;
      }

      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');

        if (href) {
          const url = new URL(href, window.location.origin);
          const supportedLanguages = ['en', 'de'];
          const removeLanguagePrefix = (pathname) => {
            const parts = pathname.split('/');
            if (parts.length > 1 && supportedLanguages.includes(parts[2])) {
              parts.splice(2, 1); 
              return parts.join('/') || '/';
            }
            return pathname;
          };

          const currentPath = removeLanguagePrefix(window.location.pathname);
          const targetPath = removeLanguagePrefix(url.pathname);

          const isSamePage = url.origin === window.location.origin &&
                         currentPath === targetPath;

          if (href.startsWith('#') || (isSamePage && url.hash)) {

            event.preventDefault();

            const elementId = href.startsWith('#') ? href.substring(1) : url.hash.substring(1);
            const element = document.getElementById(elementId);
            console.log("element");
            console.log(element);
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 190;
            const scrollToPosition = elementPosition - offset;

            window.scrollTo({
              top: scrollToPosition,
              behavior: 'smooth',
            });            
          }
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []); 
  
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const isPagesApp = window.location.search.includes("mgnlPreview");
  const editMode = isPagesApp ? true : false;
  
  /* Rendering Languages */
  function renderLanguages() {
    const currentLanguage = getCurrentLanguage();    
    const languages = getLanguages();
    return (
      <div className="languagesContainer">
        <GrLanguage/>
        <div 
          className="currentLanguage" 
          onClick={() => setLangDropdownOpen(prev => !prev)}
        >
          <span>{currentLanguage}</span>
          {langDropdownOpen ? <GrFormUp/> : <GrFormDown/>}
        </div>
        {langDropdownOpen && (
          <div className="languagesDropdown">
            {languages.map((lang) => (
              <span
                key={`lang-${lang}`}
                data-active={currentLanguage === lang}
                onClick={() => {
                  changeLanguage(lang);
                  setLangDropdownOpen(false);
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }


  const [query, setQuery] = useState("");  
  const [errorMessage, setErrorMessage] = useState(""); 

  /* Setting top position and min-height of Page Content */
  const headerRef = React.useRef(null);  
  const topNavRef = React.useRef(null); 
  const pageRef = React.useRef(null);
  
  // React.useEffect(() => {
  //   var interval = setInterval(() => {    
  //     const headerHeight = headerRef.current.getBoundingClientRect().height;
  //     const topNavHeight = topNavRef.current.getBoundingClientRect().height;
  //     const topHeight = headerHeight + topNavHeight;
  //     topNavRef.current.style.top = headerHeight + 'px';
  //     pageRef.current.style.top = topHeight + 'px';
  //     pageRef.current.style.minHeight = `calc(100vh - ${topHeight}px)`;
  //   }, 300)
  //   setTimeout(function( ) { clearInterval( interval ); }, 6000);
  // }, []);

  /* Getting props from headerConfig for setting logo and logo link */
  const baseUrl = process.env.REACT_APP_MGNL_HOST_NEW; 
  const apiBase = getAPIBase();
  const restPath = process.env.REACT_APP_MGNL_API_PAGES;
  const nodeName = process.env.REACT_APP_MGNL_APP_BASE;  
  const isAuthor = JSON.parse(process.env.REACT_APP_MGNL_IS_PREVIEW);

  const [configProps, setConfigProps] = useState();
  const [userData, setUserData] = useState();
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBase}${restPath}${nodeName}/Config-Pages/Main-Config/headerConfigComponent/@nodes`)
      .then(response => response.json())
      .then(data => {
        let result = data[0];
        setConfigProps(result);
      });
  }, [apiBase, restPath, nodeName]);

  const [showLogout, setShowLogout] = useState("false");

  useEffect(() => {
    setShowLogout(configProps?.showLogout)
  }, [configProps?.showLogout]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    fetch(`${baseUrl}/rest/administration/users/_current`)
      .then(response => {
        if (!response.ok) { // Ako status nije OK (npr. 403)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUserData(data);
        setIsUserLogged(!!data?.login);
        setIsUserLoaded(true); // Podaci su učitani
      })
      .catch(error => {
        // U slučaju greške, označavamo da su korisnički podaci učitani i da korisnik nije ulogovan
        setIsUserLogged(false);
        setIsUserLoaded(true);
      });
  }, []);  

  /* Setting pathname */
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    function handlePopstate() {
      setPathname(window.location.pathname);
    }   

    events.on('popstate', handlePopstate);
    window.addEventListener('popstate', handlePopstate);

    return () => {
      events.removeListener('popstate', handlePopstate);
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  // ???????????????????????????????
  // useEffect(() => {
  //   if (window.location.href.includes('/Search-Pages') && !editMode) {
  //     const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  //     window.history.pushState({path:newurl}, '', newurl);
  //   }
  // }, []);

  /* Questionable part of the code because of querySelector */
  var leftNavInterval = setInterval(() => {

    /* Adding active class on active nav item elemets */
    // const links = document.querySelectorAll('.menu-item > button > a');
    // const topNavLinks = document.querySelectorAll('.topNav .menu-item > button > a');
    // const topLinks = document.querySelectorAll('.topNav .level-1.menu-item > button > a');

    const leftLinks = document.querySelectorAll('.leftHandNav .menu-item > button > a');

    function setActiveLHNLink(link) {
      leftLinks.forEach((link) => {
        link.classList.remove('active');
      });
      leftLinks.forEach((leftLink) => {
        leftLink.parentNode.parentNode.parentNode.parentNode.classList.remove('active');
      });
      link.classList.add('active');
      link.parentNode.parentNode.parentNode.parentNode.classList.add('active');
      link.parentNode.parentNode.classList.add('active');
    }

    const currentLocationWithoutHash = window.location.href.split('#')[0];

    const leftLink = Array.from(leftLinks).find(link => {
      if (link.href === window.location.href) {
        return link.href === window.location.href;
      } else if (link.href === currentLocationWithoutHash)
        return link.href === currentLocationWithoutHash;
    });
    if (leftLink) {
      setActiveLHNLink(leftLink);
    } 

    const topLinks = document.querySelectorAll('.topNav .menu-item > button > a');

    function setActiveTopLink(link) {
      topLinks.forEach((link) => {
        link.classList.remove('active');
      });
      topLinks.forEach((topLink) => {
        topLink.parentNode.parentNode.parentNode.parentNode.classList.remove('active');
      });
      link.classList.add('active');
      link.parentNode.parentNode.parentNode.parentNode.classList.add('active');
    }

    const topLink = Array.from(topLinks).find(link => {
      if (link.href === window.location.href.replace('#', '/')) {
        return link.href === window.location.href.replace('#', '/');
      } else if (link.href === currentLocationWithoutHash)
        return link.href === currentLocationWithoutHash;
    });
    if (topLink) {
      setActiveTopLink(topLink);
    } 


    // function setActiveLink(link) {
    //   links.forEach((link) => {
    //     link.classList.remove('active');
    //   });
    //   leftLinks.forEach((leftLink) => {
    //     leftLink.parentNode.parentNode.parentNode.parentNode.classList.remove('active');
    //   });
    //   link.classList.add('active');
    //   link.parentNode.parentNode.parentNode.parentNode.classList.add('active');
    //   link.parentNode.parentNode.classList.add('active');
    // }

    // function setActiveTopLink(link) {
    //   topNavLinks.forEach((link) => {
    //     link.classList.remove('active');
    //   });
    //   topLinks.forEach((topLink) => {
    //     topLink.parentNode.parentNode.parentNode.parentNode.classList.remove('active');
    //   });
    //   link.classList.add('active');
    //   link.parentNode.parentNode.parentNode.parentNode.classList.add('active');  
    // }

    // const link = Array.from(links).find(link => link.href === window.location.href);
    // if (link) {
    //   setActiveLink(link);
    // }
    // const topNavLink = Array.from(topNavLinks).find(link => link.href === window.location.href);
    // if (topNavLink) {
    //   setActiveLink(topNavLink);
    // }
    
    // const topLink = Array.from(topLinks).find(link => link.href === window.location.href);
    // if (topLink) {
    //   setActiveTopLink(topLink);
    // }

    // /* Setting all chevrons in the same place */
    // const navItems = document.querySelectorAll('.leftHandNav ul li a');
    // // console.log(navItems);
    // let longestNavItemWidth = 0;
    // // console.log(longestNavItemWidth);
    // navItems.forEach(navItem => {
    //   const navItemWidth = navItem.getBoundingClientRect().width;
    //   // console.log(navItemWidth);
    //   if (navItemWidth > longestNavItemWidth) {
    //     longestNavItemWidth = navItemWidth;
    //   }
    // });
    // // console.log(longestNavItemWidth);
    // navItems.forEach(navItem => {
    //   navItem.style.width = longestNavItemWidth + 'px';
    // });

      /* Navigation BuxFix Firefox */
      var uls = document.querySelectorAll('.leftHandNav ul');
      for (var i = 0; i < uls.length; i++) {
        if (uls[i].querySelector('a.active')) {
            uls[i].style.display = 'block';
        }
      }

  }, 300);
  setTimeout(function( ) { clearInterval( leftNavInterval ); }, 6000);


  const handleClick = () => {

    if (!query || query.length < 2) {
      setErrorMessage("Mindestens 2 Zeichen eingeben");
      return;
    }

    setErrorMessage("");
    const href = (getRouterBasename() + `/Search-Pages/Global-Search?query=${query}`).replace("//", "/");
    window.history.pushState({}, "", href);
    events.emit("popstate");
    setQuery("");
  }

  const handleEnter = (value) => {

    if (!value || value.length < 2) {
      setErrorMessage("Mindestens 2 Zeichen eingeben");
      return;
    }

    setErrorMessage("");
    const href = (getRouterBasename() + `/Search-Pages/Global-Search?query=${value}`).replace("//", "/");
    window.history.pushState({}, "", href);
    events.emit("popstate");
    setQuery("");
  }

  if (!isUserLoaded && !isAuthor) {
    return <div>Loading...</div>;
  }

  if (!isUserLogged && !isAuthor) {
    window.location.href = baseUrl + "/CiPortal.do";
    return null;
  }

  return (
    <div className={`App ${editMode ? "editMode" : ""}`}>
      {loading && !editMode && (
        <div className="loader-container">
          <ClipLoader loading size={80} color="#7091a7" cssOverride={{ borderWidth: "10px" }} />
        </div>
      )}
      <PagesStyles/>   
      <HeaderStyles/>
      <NavLevelsStyles/>
      <TopNavStyles/>
      <LeftNavStyles/>
      <HeadlinesStyles/>
      <ParagraphsStyles/>
      <header ref={headerRef}>    
        <div className='header'>
          <div className='logo'>
            <a href={(getRouterBasename() + configProps?.logoPageLink).replace("//", "/").replace("Home/Home", "Home")}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", e.currentTarget.href);
                events.emit("popstate");
              }}            
            >
              <img alt="" src={require('./images/home/Logo.png') }/>
            </a>    
          </div>
          <div className='rightHeader'>
            {renderLanguages()}
            <div className='userLinks'>
              <a href={configProps?.adminLink}>
                {configProps?.adminLinkDisplayName || "Admin"}
              </a>
              <a href={configProps?.userLink}>
                {configProps?.userLinkDisplayName || userData?.login || "User"}
              </a>            
            </div>
            <div className='flex headerSearch'>
              <input 
                type='text'
                className='searchInput'
                placeholder='Search...' 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEnter(e.target.value);
                  }
                }}
              />
              <button
                type='button'
                onClick={handleClick}
              ><IoSearchOutline/></button>
              {errorMessage && (
                <div className="searchError">
                  {errorMessage}
                </div>
              )}
            </div>              
            { showLogout === "false" || false ? null :
              <div className='logout'>
                <div><a href={baseUrl + '/Logout.do'}><IoLogOutOutline/></a></div>
              </div>
            }         
          </div>
        </div>             
      </header>          
      <ForwardedTopNav ref={topNavRef}></ForwardedTopNav>    
      <div className='pageContainer' ref={pageRef}>
        <PageLoader pathname={pathname} />
        {/* <footer>
          <div className='links'>
            <div>
              <div className='heading'>CONTACT</div>
              <a href="mailto:hmbrandmaker@houstonmethodist.org" target="_blank">HM Brandmaker</a>
              <a href="mailto:creative-approvals@houstonmethodist.org" target="_blank">Creative Approvals</a>
            </div>            
            <div>
              <div className='heading'>WEBSITES</div>
              <a href="http://www.tmh.tmhs/" target="_blank">HM Intranet</a>
              <a href="http://www.houstonmethodist.org/" target="_blank">houstonmethodist.org</a>
            </div>
          </div>
          <div className='footer'>2021. Houston Methodist, Houston, TX. All rights reserved.</div>
        </footer> */}
      </div>

    </div>
  );
}


export default App;
