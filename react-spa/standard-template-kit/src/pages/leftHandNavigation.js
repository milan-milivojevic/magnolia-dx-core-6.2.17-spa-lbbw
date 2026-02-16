import React, { useEffect } from 'react';
import { EditableArea } from '@magnolia/react-editor';
import '../css.css';
import LeftHandNav from '../components/navigation/LeftHandNav';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { isPublicInstance, getCurrentLanguage } from '../helpers/AppHelpers';
import { LoaderOverlay } from './LoaderOverlay';
import useHashScroll from './useHashScroll';

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

  
  const leftNavRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const loading = useHashScroll(contentRef, { offset: 250 });

  const isPagesApp = window.location.search.includes("mgnlPreview");
  const editMode = isPagesApp ? "editMode" : "";


return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {!editMode && <LoaderOverlay loading={loading} />}

      <div className="leftNavPage">
        <ForwardedLeftHandNav />
        <main
          className="rightMainContent"
          ref={contentRef}
          style={{ opacity: loading ? 0 : 1, transition: "opacity 0.2s" }}
        >
          <div className="bannerSection">
            {bannerSection && <EditableArea content={bannerSection} />}
          </div>
          {mainSection && <EditableArea content={mainSection} />}
        </main>
      </div>
    </HelmetProvider>
  );
}

export default LeftHandNavigationPage;
