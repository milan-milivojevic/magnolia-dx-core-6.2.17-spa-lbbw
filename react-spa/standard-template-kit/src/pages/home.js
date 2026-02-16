import React, { useRef } from "react";
import { EditableArea } from "@magnolia/react-editor";
import "../css.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { LoaderOverlay, useImagesLoaded } from './LoaderOverlay';

function HomePage (props) {
  const {title, bannerSection, mainSection, footerSection } = props;

  const contentRef = useRef(null);
  const loading = useImagesLoaded(contentRef);

  const isPagesApp = window.location.search.includes("mgnlPreview");
  const editMode = isPagesApp ? "editMode" : "";

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {!editMode && <LoaderOverlay loading={loading} />}

      <div className="homePage" ref={contentRef} style={{ opacity: loading ? 0 : 1, transition: "opacity 0.2s" }}>
        <div className='bannerSection'>{bannerSection && <EditableArea content={bannerSection} />}</div>
        <div>{mainSection && <EditableArea content={mainSection} />}</div>
        <div>{footerSection && <EditableArea content={footerSection} />}</div>
      </div>
    </HelmetProvider>
  );
}

export default HomePage;
