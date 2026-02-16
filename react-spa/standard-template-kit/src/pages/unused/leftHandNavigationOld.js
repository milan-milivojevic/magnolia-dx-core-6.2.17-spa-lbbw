import React, { useEffect } from 'react';
import { EditableArea } from '@magnolia/react-editor';
import '../css.css';
import LeftHandNav from '../../components/navigation/LeftHandNav';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { isPublicInstance, getCurrentLanguage } from '../../helpers/AppHelpers';

const ForwardedLeftHandNav = React.forwardRef(LeftHandNav);

function LeftHandNavigationPage (props) {
  const { title, componentId, bannerSection, mainSection } = props;

  const isPublic = isPublicInstance();
  
  useEffect(() => {
    let intervalId;
    const duration = 5000;
    const intervalTime = 500;

    const generateHrefFromUrl = (url) => {
      if (!url.includes('Home')) return null;
    
      const [leftPart, rest] = url.split('Home');
      const rightPart = rest.split('/')[1];
    
      if (!leftPart || !rightPart) return null;
    
      const instance = isPublic ? "cmsPublic" : "cmsAuthor";
      const segments = leftPart.split('/').filter(Boolean);
      const closestSegment = segments[segments.length - 1] || "";
      const language = closestSegment !== instance && closestSegment.length === 2 ? "/"+closestSegment : "";

      return `/${instance}${language}/Home/${rightPart}`;
    };    

    const checkAndHighlightElement = () => {

      const allElements = document.querySelectorAll('li.level-0 > button > a');
      allElements.forEach((el) => {
        el.style.color = '#123250';
      });

      const currentUrl = window.location.pathname; 
      const generatedHref = generateHrefFromUrl(currentUrl);

      if (generatedHref) {

        const targetElement = document.querySelector(`li.level-0 > button > a[href="${generatedHref}"]`);

        if (targetElement) {
          targetElement.style.color ='#37c391';
        }
      }
    };

    intervalId = setInterval(checkAndHighlightElement, intervalTime);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    // Check if the URL contains the fragment identifier
    if (window.location.hash) {
      // Scroll to the element with the matching ID
      const trimmedHash = window.location.hash.substring(1)
      const element = document.getElementById(trimmedHash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.scrollBy(0, -250);
    }
  }, []); 


  var interval = setInterval(() => {
    if (window.location.hash) {
      // Scroll to the element with the matching ID
      const trimmedHash = window.location.hash.substring(1)
      const element = document.getElementById(trimmedHash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.scrollBy(0, -250);
    }} , 500);
  setTimeout(function( ) { clearInterval( interval ); }, 5000);
  

  const isPagesApp = window.location.search.includes("mgnlPreview");
  const editMode = isPagesApp ? "editMode" : "";

  /*Setting height and position of Left Navigation and min-height of Page Content*/
  const leftNavRef = React.useRef(null);
  const contentRef = React.useRef(null);

  

  // React.useEffect(() => {
  //   var interval = setInterval(() => {    
  //     /* Questionable part of the code because of querySelector */
  //     const header = document.querySelector('header');
  //     const footer = document.querySelector('footer');
  //     const topNav = document.querySelector('.topNav');
  //     const lefNav = document.querySelector('.leftHandNav > .menus');
  //     const headerHeight = header.getBoundingClientRect().height;
  //     const footerHeight = footer.getBoundingClientRect().height;
  //     const topNavHeight = topNav.getBoundingClientRect().height;
  //     const calcHeight = headerHeight + topNavHeight + footerHeight;   
  //     if (leftNavRef.current) {
  //       leftNavRef.current.style.height = `calc(100vh - ${calcHeight}px)`;
  //       leftNavRef.current.style.bottom = footerHeight + 'px';
  //       lefNav.style.maxHeight = `calc(100% + ${footerHeight}px)`;        
  //     }      
  //     if (leftNavRef.current) {
  //       contentRef.current.style.minHeight = `calc(100vh - ${calcHeight}px)`;
  //     }
  //   }, 300)
  //   setTimeout(function( ) { clearInterval( interval ); }, 4500);
  // }, []);  

  setTimeout(() => {
    const loaderElement = document.querySelector(".loader-container");
    if (loaderElement) {
      loaderElement.remove();
    }
  }, 1000);

  return (
    <HelmetProvider>
      <Helmet>
          <title>{title}</title>
      </Helmet>
      { (editMode !== "editMode") &&
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      }
      <div className='leftNavPage'>
        <ForwardedLeftHandNav ref={leftNavRef}></ForwardedLeftHandNav>
        <div className='rightMainContent' ref={contentRef}>
          <div className='bannerSection'>{bannerSection && <EditableArea content={bannerSection} />}</div>
          <div>{mainSection && <EditableArea content={mainSection} />}</div>
        </div>      
      </div>
    </HelmetProvider>
  );
}

export default LeftHandNavigationPage;