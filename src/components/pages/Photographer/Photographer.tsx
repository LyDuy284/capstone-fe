import React from 'react'
import "./Photographer.css"
import SearchIcon from '@mui/icons-material/Search';
import { Button, Checkbox } from '@mui/material';

const Photographer = () => {
    return (
        <div id='Photographer'>
            <div className="row">
                <div className="col-left cover-search">
                    <div className="landing-search">
                        <h1 className="header-search">
                            Chụp ảnh cưới
                        </h1>
                        <span className="description-search">
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
            </div>
            <div className="content">
                <aside className='aside-bar'>
                    <div className="filter-component">
                        <legend className="filter-name">Chi phí</legend>
                        <ul className="filter-list">
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> Under $1,000</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $1,000 - $1,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $2,000 - $3,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $3,000 - $4,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $4,000+</li>
                        </ul>
                    </div>
                    <div className="filter-component">
                        <legend className="filter-name">Chi phí</legend>
                        <ul className="filter-list">
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> Under $1,000</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $1,000 - $1,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $2,000 - $3,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $3,000 - $4,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $4,000+</li>
                        </ul>
                    </div>
                    <div className="filter-component">
                        <legend className="filter-name">Chi phí</legend>
                        <ul className="filter-list">
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> Under $1,000</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $1,000 - $1,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $2,000 - $3,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $3,000 - $4,999</li>
                            <li className="filter-item"><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} /> $4,000+</li>
                        </ul>
                    </div>
                </aside>
                <div className="filter-content">
                    <div className="content-header"><strong>80</strong> results</div>
                    <ul className="content-list">
                        <li className="content-item">
                            <div className="content-gallery">
                                <img src="https://cdn0.weddingwire.com/vendor/262779/3_2/640/png/ww-storefront_51_977262-167476398667285.webp" alt="" />
                            </div>
                            <div className="content-infor">
                                <h2 className="item-title">Sound Originals Photo & Video</h2>
                                <div className="item-subtitle">
                                    <div className="item-rating">5.0</div>
                                    <span className="item-location">San Francisco, CA</span>
                                </div>

                                <p className="item-description">
                                    <span>Sound Originals Photo & Video is a 5-star photography and videography team.
                                        Couples love Sound Originals!
                                        Storytelling</span>
                                    <span className="read-more"> Lasts Forever.
                                        Y dedicated to excellent quality. Artistic portraits.Y dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. ArtiY dedicated to excellent quality. Arti</span>
                                </p>
                                <div className="item-footer">
                                    <Button className="btn-item" variant="contained">Request pricing</Button>
                                </div>
                            </div>
                        </li>
                        <li className="content-item">
                            <div className="content-gallery">
                                <img src="https://cdn0.weddingwire.com/vendor/262779/3_2/640/png/ww-storefront_51_977262-167476398667285.webp" alt="" />
                            </div>
                            <div className="content-infor">
                                <h2 className="item-title">Sound Originals Photo & Video</h2>
                                <div className="item-subtitle">
                                    <div className="item-rating">5.0</div>
                                    <span className="item-location">San Francisco, CA</span>
                                </div>

                                <p className="item-description">
                                    <span>Sound Originals Photo & Video is a 5-star photography and videography team.
                                        Couples love Sound Originals!
                                        Storytelling</span>
                                    <span className="read-more"> Lasts Forever.
                                        Your story deserves beautiful photos and videos you absolutely love. Sound Originals is a small team of artists dedicated to excellent quality. Artistic portraits.</span>
                                </p>
                                <div className="item-footer">
                                    <div></div>
                                    <Button className="btn-item" variant="contained">Request pricing</Button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Photographer