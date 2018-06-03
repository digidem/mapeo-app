// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { NavigationActions } from 'react-navigation';
import { StoreState } from '../../../types/redux';

import { observationUpdate } from '../../../ducks/observations';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps, DispatchProps } from './ObservationDetailView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    selectedObservation: state.app.selectedObservation,
    categories: state.app.categories
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    goToEditorView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ObservationEditor'
        })
      ),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToPhotoView: params =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: {
            fromDetailView: params.fromDetailView,
            photoType: params.type,
            photoSource: params.source
          }
        })
      ),
    goBack: () => dispatch(NavigationActions.back())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ObservationDetailView
);
