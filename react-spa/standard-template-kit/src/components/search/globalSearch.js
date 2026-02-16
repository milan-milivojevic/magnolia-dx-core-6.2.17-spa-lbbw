import React, { useState, useEffect } from "react";
import MpSearch from "./mpSearch";
import W2PSearch from "./w2pSearch";
import StaticSearch from "./staticSearch";
import { IoSearchOutline } from 'react-icons/io5';

function GlobalSearch({
  sortOrder,  
  perPage,
  perRow,
  defaultView,
  downloadButton,
  emailButton,
  detailsButton,
  copyLinkButton,

  templatesSortOrder,
  templatesPerPage,
  templatesPerRow,
  templatesDefaultView,
  detailsTemplateButton,
  favouritesButton,
  createDocumentButton, 
  copyTemplateLinkButton
}) {

  const [currentView, setCurrentView] = useState('static'); 
  const [query, setQuery] = useState("");
  const [tempQuery, setTempQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = new URLSearchParams(window.location.search);
  const urlQuery = searchParams.get('query');

  useEffect(() => {
    setQuery(urlQuery);
    setTempQuery(urlQuery);
  }, []);

  const getPlaceholderText = (view) => {
    switch (view) {
      case 'mp':
        return "Suche Medien Datenbank...";
      case 'w2p':
        return "Suche Templates...";
      case 'static':
        return "Suche Brand Portal...";
      default:
        return "Suche Medien Datenbank...";
    }
  };

  const handleSearch = () => {
    if (tempQuery?.length < 2) {
      setErrorMessage("Mindestens 2 Zeichen eingeben");
      return;
    }
    setErrorMessage("");
    setQuery(tempQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSearch();
    }
  };

  return (
    <div className="globalSearch">

      <div className="globalSearchHeader">
        <div className="globalSearchButtons">
          <button className={currentView === 'static' ? "active" : null} onClick={() => setCurrentView('static')}>
            Content Suche
          </button>
          <button className={currentView === 'mp' ? "active" : null} onClick={() => setCurrentView('mp')}>
            Mediendatenbank Suche
          </button>
          {/* <button className={currentView === 'w2p' ? "active" : null} onClick={() => setCurrentView('w2p')}>
               W2P Suche
             </button> */}            
        </div>

        <div className="flex headerSearch">
          <input
            className="searchInput"
            type="text"
            placeholder={getPlaceholderText(currentView)}
            value={tempQuery || ""}
            onChange={(e) => setTempQuery(e.target.value)}   
            onKeyDown={handleKeyDown}
          />
          <button type="button" onClick={handleSearch}>
            <IoSearchOutline />
          </button>
          {errorMessage && (
          <div className="searchError">
            {errorMessage}
          </div>
        )}
        </div>
      </div>

      

      {currentView === 'mp' &&
        <MpSearch
          globalQuery={query}
          perPage={perPage}
          perRow={perRow}
          sortOrder={sortOrder}
          defaultView={defaultView}
          downloadButton={downloadButton}
          emailButton={emailButton}
          detailsButton={detailsButton}
          copyLinkButton={copyLinkButton}
        />
      }
      {currentView === 'w2p' &&
        <W2PSearch
          globalQuery={query}
          sortOrderTemplates={templatesSortOrder}
          perPage={templatesPerPage}
          perRow={templatesPerRow}
          defaultView={templatesDefaultView}
          detailsButton={detailsTemplateButton}
          favouritesButton={favouritesButton}
          createDocumentButton={createDocumentButton}
          copyLinkButton={copyTemplateLinkButton}
        />
      }
      {currentView === 'static' &&
        <StaticSearch 
          globalQuery={query}
        />
      }
    </div>
  );
}

export default GlobalSearch;
