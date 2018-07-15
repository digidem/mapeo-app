// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import {
  observationCreate,
  observationUpdate,
} from '../../../ducks/observations';
import { mediaSaveToCameraRoll } from '../../../ducks/media';
import { observationSource } from '../../../ducks/observationSource';
import type { StoreState, Action } from '../../../types/redux';
import CameraView from './CameraView';
import type { Props, StateProps, DispatchProps } from './CameraView';
import { drawerClose, drawerOpen } from '../../../ducks/drawers';

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  return {
    observations: state.app.observations,
    selectedObservation: state.app.selectedObservation,
    showSavedModal: state.app.modals.saved,
    showEditorView:
      ownProps.navigation &&
      ownProps.navigation.state &&
      ownProps.navigation.state.params &&
      ownProps.navigation.state.params.showEditorView,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    createObservation: observation => dispatch(observationCreate(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    onDrawerClose: () => dispatch(drawerClose('observations')),
    onDrawerOpen: () => dispatch(drawerOpen('observations')),
    updateObservationSource: () => dispatch(observationSource('camera')),
    saveToCameraRoll: meta => dispatch(mediaSaveToCameraRoll(meta)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraView);
