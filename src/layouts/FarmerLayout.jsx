import React from "react";
import Sidebar from "../components/Sidebar";
import "../pages/Farmer/FarmerDashboard.css";//sidebar + main styles imported

function FarmerLayout({children}){
    return(
        <div className='dashboard-container'>
            <Sidebar/>

            <main className='main-content'>
                {children}
            </main>
        </div>
    );
}

export default FarmerLayout;