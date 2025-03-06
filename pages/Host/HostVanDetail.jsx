import React from "react";
import { useParams, Link, NavLink, Outlet } from "react-router-dom";
import { getVan } from "../../api";

export default function HostVanDetail() {
  // checking if there vans in the local storage, this will help us to reduce calls to the database
  const savedVans = localStorage.getItem("vans")
    ? JSON.parse(localStorage.getItem("vans"))
    : [];

  const [currentVan, setCurrentVan] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { id } = useParams();

  function getVanFromStorage(id) {
    return savedVans.filter((van) => van.id === id)[0];
  }

  React.useEffect(() => {
    async function loadVans() {
      setLoading(true);
      try {
        // if there is no vans in the localstorage then make a call to the database
        if (savedVans.length === 0) {
          const data = await getVan(id);
          setCurrentVan(data);
        } else {
          const data = getVanFromStorage(id);
          setCurrentVan(data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadVans();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>There was an error: {error.message}</h1>;
  }

  const activeStyles = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#161616",
  };

  return (
    <section>
      <Link to=".." relative="path" className="back-button">
        &larr; <span>Back to all vans</span>
      </Link>
      {currentVan && (
        <div className="host-van-detail-layout-container">
          <div className="host-van-detail">
            <img src={currentVan.imageUrl} />
            <div className="host-van-detail-info-text">
              <i className={`van-type van-type-${currentVan.type}`}>
                {currentVan.type}
              </i>
              <h3>{currentVan.name}</h3>
              <h4>${currentVan.price}/day</h4>
            </div>
          </div>

          <nav className="host-van-detail-nav">
            <NavLink
              to="."
              end
              style={({ isActive }) => (isActive ? activeStyles : null)}
            >
              Details
            </NavLink>
            <NavLink
              to="pricing"
              style={({ isActive }) => (isActive ? activeStyles : null)}
            >
              Pricing
            </NavLink>
            <NavLink
              to="photos"
              style={({ isActive }) => (isActive ? activeStyles : null)}
            >
              Photos
            </NavLink>
          </nav>
          <Outlet context={{ currentVan }} />
        </div>
      )}
    </section>
  );
}
