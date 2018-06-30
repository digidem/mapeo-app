// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { withNavigationFocus } from 'react-navigation';
import { StoreState } from '../../../types/redux';
import { categoryList } from '../../../ducks/categories';
import {
  observationUpdate,
  observationSelect
} from '../../../ducks/observations';
import { observationSource } from '../../../ducks/observationSource';
import Categories from './Categories';
import type { StateProps } from './Categories';

function mapStateToProps(state: StoreState): StateProps {
  const categories = values(state.app.categories).sort(
    (a, b) => a.name - b.name
  );
  const { selectedObservation, observations } = state.app;

  let updateFlow = false;
  if (selectedObservation && observations[selectedObservation.id]) {
    updateFlow = true;
  }

  return {
    allFields: state.app.fields,
    categories,
    selectedObservation,
    updateFlow,
    icons: state.app.icons
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    listCategories: () => {
      dispatch(categoryList(''));
    },
    clearSelectedObservation: () => {
      dispatch(observationSelect(undefined));
      dispatch(observationSource(undefined));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(Categories)
);
