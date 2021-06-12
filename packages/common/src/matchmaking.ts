// Matchmaking

export interface HelloMsg {
    type: 'hello_msg',
    id: string
}

export const isHelloMsg = (message: any): message is HelloMsg => {
    return (message.type && message.type === 'hello_msg');
}
