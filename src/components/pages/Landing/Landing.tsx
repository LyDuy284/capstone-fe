import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import "./Landing.css";
import NavSearching from '../NavSearching/NavSearching';

const Landing = () => {

    return (
        <div id='Landing'>
            <div className="row">
                <div className="col-haft cover-search">
                    <div className="landing-search">
                        <h1 className="header-search">
                            Let's find your wedding team
                        </h1>
                        <span className="description-search">
                            Search over 250,000 local professionals with reviews,<br></br> pricing, availability, and more
                        </span>
                        <div className="search-container">
                            <div className="search" style={{ borderRadius: '1rem 0 0 1rem' }}>
                                <SearchIcon style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />
                                <input type="text" className="input" placeholder="Search for vendors" />
                            </div>
                            <div className="search">
                                <div>in</div>
                                <input type="text" className="input" placeholder="Location" />
                            </div>
                            <Button className="btn-search" variant="contained">Search</Button>
                        </div>
                    </div>
                </div>
                <div className="col-haft">
                    <img src="https://cdn1.weddingwire.com/assets/img/home/bg_hero1.jpg" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Landing;