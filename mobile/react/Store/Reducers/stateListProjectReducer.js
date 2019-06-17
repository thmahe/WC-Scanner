const initialListProject = {listProject : []};

function stateListProject(state = initialListProject, action) {
    let nextState;
    switch (action.type) {
        case 'STATE_RELOAD_LISTPROJECT':
            nextState = {...state, listProject: action.value};
            return nextState || state;
        default:
            return state;
    }
}

export default stateListProject;