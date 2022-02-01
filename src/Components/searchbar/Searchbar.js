import { useState } from 'react';
import PropTypes from 'prop-types';
import s from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const [searchName, setSearchName] = useState('');

  const handleSearchNameChange = event => {
    const { value } = event.target;
    setSearchName(value);
  };

  const HandleSubmit = event => {
    event.preventDefault();

    if (searchName.trim() === '') {
      return;
    }
    onSubmit(searchName);
    setSearchName('');
  };

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={HandleSubmit}>
        <button type="submit" className={s.SearchFormButton}>
          <span className={s.SearchFormButtonlabel}>Search</span>
        </button>

        <input
          className={s.SearchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchName}
          onChange={handleSearchNameChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = { onSubmit: PropTypes.func.isRequired };
