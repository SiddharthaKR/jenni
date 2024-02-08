import React from 'react';

interface SearchQueryBlockProps {
  title: string;
  snippet: string;
  summary: string;
  fileFormat: string;
  resourcesTitle: string;
  serpapiCiteLink: string;
  onClick: () => void;
}

const SearchQueryBlock: React.FC<SearchQueryBlockProps> = ({ title='', snippet='', summary='', fileFormat='', resourcesTitle='', serpapiCiteLink='',onClick }) => {
  return (
    <div onClick={onClick} className='shadow-lg'>
      <h3>{title}</h3>
      <p>{snippet}</p>
      <p>Summary: {summary}</p>
      <p>File Format: {fileFormat}</p>
      <p>Resources Title: {resourcesTitle}</p>
      <p>Cite Link: <a href={serpapiCiteLink}>{serpapiCiteLink}</a></p>
    </div>
  );
};

export default SearchQueryBlock;
