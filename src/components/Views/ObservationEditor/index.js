// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';

import { observationUpdate } from '../../../ducks/observations';
import { modalShow } from '../../../ducks/modals';
import ObservationEditor from './ObservationEditor';
import type { Props, StateProps, DispatchProps } from './ObservationEditor';

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  return {
    category:
      (state.app.categories &&
        ownProps.navigation.state &&
        ownProps.navigation.state.params &&
        ownProps.navigation.state.params.category &&
        state.app.categories[ownProps.navigation.state.params.category]) ||
      undefined,
    selectedObservation: state.app.selectedObservation,
    observations: values(state.app.observations)
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToPhotoView: source =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: { photoSource: source }
        })
      ),
    goToCameraView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'CameraView',
          params: { source: 'editor' }
        })
      ),
    goToCategories: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'Categories',
          key: 'CategoriesView'
        })
      ),
    goToObservationFields: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ObservationFields'
        })
      ),
    goBack: () => {
      dispatch(NavigationActions.back());
    },
    goToTabBarNavigation: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'TabBarNavigation',
          params: { showModal: true }
        })
      ),
    showSavedModal: () => dispatch(modalShow('saved'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationEditor);
