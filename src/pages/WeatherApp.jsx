import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getWeatherByLocation,
  getSearchResults,
  setSearchBy,
} from '../store/actions/weatherActions';
import { saveFavorite, removeFavorite, loadFavorites } from '../store/actions/favoriteActions';
import { WeatherSearch } from '../cmps/WeatherSearch';
import { WeatherCard } from '../cmps/WeatherCard/WeatherCard';
import { utilService } from '../services/util.service';
import { favoriteService } from '../services/favoriteService';
import { weatherService } from '../services/weather.service';
import { DefaultLocation } from '../utils/constants';

export const WeatherApp = ({ match }) => {
  const dispatch = useDispatch();
  const { location, currentConditions, dailyForecast, searchResults } = useSelector(
    (state) => state.weatherModule
  );
  const { favorites } = useSelector((state) => state.favoriteModule);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    handleLoad();
  }, [match.params.id]);

  const handleLoad = async () => {
    await dispatch(loadFavorites());
    await loadLocationByParams();
    await findSetIsFavorite();
  };

  // TODO - why callback (from Robots file)?
  const onSearch = useCallback((txt) => {
    dispatch(setSearchBy(txt));
    dispatch(getSearchResults());
  }, []);

  const onSelectString = (searchBy) => {
    if (searchBy) console.log('searchBy:', searchBy);
  };

  const onSelectLocation = (location) => {
    dispatch(getWeatherByLocation(location));
    dispatch(setSearchBy(null));
  };

  const onToggleIsFavorite = () => {
    setIsFavorite(!isFavorite);
    const idx = favorites.findIndex((f) => f.location.Key === location.Key);
    if (idx !== -1) {
      const favoriteToRemove = favorites[idx];
      dispatch(removeFavorite(favoriteToRemove.id));
    } else {
      const newFavorite = {
        location: location,
        currentConditions: currentConditions,
        dailyForecast: dailyForecast,
      };
      dispatch(saveFavorite(newFavorite));
    }
  };

  const loadLocationByParams = async () => {
    const { id } = match.params;
    let favorite = {};
    try {
      favorite = id ? await favoriteService.getById(id) : favoriteService.getEmptyFavorite();
    } catch (err) {
      console.log("Couldn't get favorite: ", err);
    } finally {
      favorite.location
        ? dispatch(getWeatherByLocation(favorite.location))
        : dispatch(getWeatherByLocation());
    }
  };

  const findSetIsFavorite = async () => {
    const currLocation = location || DefaultLocation;
    const currFavorites = await favoriteService.query();
    const idx = currFavorites.findIndex((f) => {
      return f.location.Key === currLocation.Key;
    });
    const isFavoriteVal = idx !== -1;
    setIsFavorite(isFavoriteVal);
  };

  return (
    <div className="weather-page container">
      <WeatherSearch
        onSearch={utilService.debounce(onSearch)}
        onSelectLocation={onSelectLocation}
        onSelectString={onSelectString}
        searchResults={searchResults}
      />
      <WeatherCard
        location={location}
        currentConditions={currentConditions}
        dailyForecast={dailyForecast}
        onToggleIsFavorite={onToggleIsFavorite}
        isFavorite={isFavorite}
      />
    </div>
  );
};
