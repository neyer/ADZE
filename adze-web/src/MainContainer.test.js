import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MainContainer from './MainContainer.js'
import { Provider } from 'react-redux'
import store from './store.js'

test('tab navigation works', () => {
  render(
    <Provider store={store}>
      <MainContainer />
    </Provider>
   );

  var tabLinkToHeader = {
    feed: "Recommended Links from your Peers",
  }
  tabLinkToHeader["my links"] = "Links you are recommending";
  tabLinkToHeader["my peers"] = "Peers whose recommendations you are following";
  tabLinkToHeader["setup"] = "For Uploadin'";


  Object.entries(tabLinkToHeader).forEach(function([linkText, headerText]) {
    //  select this tab
    userEvent.click(screen.getByText(linkText));
  
    // assert that this tab's header is visible
    const thisTabHeader = screen.getByText(headerText);
    expect(thisTabHeader).toBeVisible();

    // assert that other tabs headers are not visible
    Object.entries(tabLinkToHeader).forEach(function([otherText, otherHeaderText]) { 
      if (linkText === otherText) {
        return;
      }
      console.log("Checking visbility of "+otherHeaderText);
      const otherTabHeader = screen.getByText(otherHeaderText);
      expect(otherTabHeader).not.toBeVisible();

    });
  
  });

});
