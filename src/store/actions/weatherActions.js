import { weatherService } from '../../services/weather.service';
import { DefaultLocation, UserMsgTypes } from '../../utils/constants';
import { utilService } from '../../services/util.service';

export function getWeatherByLocation(location = DefaultLocation) {
  return async (dispatch) => {
    try {
      // TODO - change to Promise.all? Split into two actions?
      // TODO - get the set location out into its own thing just like searchBy
      const locationKey = location.Key;
      const currentConditions = await weatherService.getCurrentConditions(locationKey);
      const dailyForecast = await weatherService.getDailyForecast(locationKey);
      dispatch({ type: 'SET_LOCATION', location });
      dispatch({ type: 'SET_CURRENT_CONDITIONS', currentConditions });
      dispatch({ type: 'SET_DAILY_FORECAST', dailyForecast });
    } catch (error) {
      console.log("Couldn't get weather for the location", error);
      const userMsgTxt = `Could not get weather, see console for details`;
      utilService.sendUserMsg(UserMsgTypes.error, userMsgTxt);
    }
  };
}

export function getSearchResults() {
  return async (dispatch, getState) => {
    try {
      const { searchBy } = getState().weatherModule;
      const searchResults = searchBy ? await weatherService.getSearchResults(searchBy) : [];
      dispatch({ type: 'SET_SEARCH_RESULTS', searchResults });
      return searchResults;
    } catch (error) {
      console.log("Couldn't get search results: ", error);
      const userMsgTxt = `Could not get search results, see console for details`;
      utilService.sendUserMsg(UserMsgTypes.error, userMsgTxt);
    }
  };
}
export function setSearchBy(txt) {
  return (dispatch) => {
    dispatch({ type: 'SET_SEARCH_BY', txt });
  };
}
