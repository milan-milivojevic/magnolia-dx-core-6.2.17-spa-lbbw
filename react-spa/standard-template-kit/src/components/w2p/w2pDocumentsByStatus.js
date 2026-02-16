import React, { useEffect, useState } from 'react';
import { myDocumentsService, inWorkDocumentsService, finalizedDocumentsService, rejectedDocumentsService, waitingApprovalDocumentsService, archivedDocumentsService  } from '../../api/w2pSearchService'
import DocumentCard from './helpers/DocumentCard';


function W2PDocumentsByStatus ({  
  documentStatuses,
  sortOrderDocuments,
  cardsLimit,
  perRow,
  defaultView,

  detailsButton,
  editButton,  
  downloadButton,
  emailButton,
  deleteButton,

  title,
  titleLevel,
  titlePosition,
  titleFontFamily,
  titleColor,
  titleFontSize,
  titlePaddingTop,
  titlePaddingBottom,
  titlePaddingLeft,
  titlePaddingRight
}) {
  
  const initialSortOrder = sortOrderDocuments ? sortOrderDocuments : "modificationDate,desc";
  const splitedSortOrder = initialSortOrder.split(',');
  const initialSortType = splitedSortOrder[0];
  const initialSortDirection = splitedSortOrder[1] === "asc" ? "asc" : "desc";

  const [products, setProducts] = useState([]);

  const size = cardsLimit ? cardsLimit > 60 ? 66 : (Number(cardsLimit) + 6) : 26;

  const getMyDocuments = async (size, sortType, sortDirection) => {
    const response = await myDocumentsService(size, sortType, sortDirection);
    setProducts([]);
    setProducts(response.rows);
  }

  const getInWorkDocuments = async (size, sortType, sortDirection) => {
    const response = await inWorkDocumentsService(size, sortType, sortDirection);
    setProducts([]);
    setProducts(response.rows);
  }

  const getFinalizedDocuments = async (size, sortType, sortDirection) => {
    const response = await finalizedDocumentsService(size, sortType, sortDirection);
    setProducts([]);
    setProducts(response.rows);
  }

  const getWaitingApprovalDocuments = async (size, sortType, sortDirection) => {
    const response = await waitingApprovalDocumentsService(size, sortType, sortDirection);
    setProducts([]);
    setProducts(response.rows);
  }

  const getRejectedDocuments = async (size, sortType, sortDirection) => {
    const response = await rejectedDocumentsService(size, sortType, sortDirection);
    setProducts([]);
    setProducts(response.rows);
  }

  const getArchivedDocuments = async (size, sortType, sortDirection) => {
    const response = await archivedDocumentsService(size, sortType, sortDirection);
    setProducts([]);
    setProducts(response.rows);
  }

  useEffect(() => {
    documentStatuses && documentStatuses === "my" && getMyDocuments(size, initialSortType, initialSortDirection);
    documentStatuses && documentStatuses === "in-work" && getInWorkDocuments(size, initialSortType, initialSortDirection);
    documentStatuses && documentStatuses === "finalized" && getFinalizedDocuments(size, initialSortType, initialSortDirection);
    documentStatuses && documentStatuses === "in-approval" && getWaitingApprovalDocuments(size, initialSortType, initialSortDirection);
    documentStatuses && documentStatuses === "rejected" && getRejectedDocuments(size, initialSortType, initialSortDirection);
    documentStatuses && documentStatuses === "archived" && getArchivedDocuments(size, initialSortType, initialSortDirection);
  }, []);

  const buttonProps = {
    detailsButton,
    editButton,
    emailButton,
    downloadButton,
    deleteButton,
  };

  const TitleLevel = titleLevel || "h1";

  const titleStyles = {
    fontFamily: titleFontFamily || null,
    textAlign:  titlePosition || null,
    fontSize: titleFontSize || null,
    color: titleColor || null,
    paddingTop: titlePaddingTop || null,
    paddingRight: titlePaddingRight || null,
    paddingBottom: titlePaddingBottom || null,
    paddingLeft: titlePaddingLeft || null
  }  

  
  return (
    <div className='mpSearchComponent w2p documents'>
      {title &&
        <TitleLevel className="title" style={titleStyles}>
          {title}
        </TitleLevel>
      }
      {products && products.length > 0 ? (
          <div className={`mpSearchContainer documentsByStatus ${defaultView}`} style={{ gridTemplateColumns: `repeat(${perRow ? perRow : 5}, 1fr)` }}>
            {products.map(c => 
              <DocumentCard
                documentData={c}
                key={c.id}
                buttonProps={buttonProps}
            />
            )}
          </div>
        ) : (
          <div className='mpSearchContainer'>No Results</div>
      )}      
    </div>
  )

}

export default W2PDocumentsByStatus;