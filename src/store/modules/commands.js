export default {
    namespaced: true,
    state: {
        commands: {}
    },
    mutations: {
        registerCommand: (state, {commandName, command}) => {
            state.commands[commandName] = command;
        },
        deleteCommand: (state, commandName) => {
            if(state.commands.hasOwnProperty(commandName)) delete state.commands[commandName];
        }
    },
    actions: {
        run: ({state}, {commandName, payload}) => {
            if(state.commands.hasOwnProperty(commandName)) return state.commands[commandName](payload);
            else return false;
        }
    }
}