
// True if code is ran with ts-node
export const is_ts_node = () =>
{
    // @ts-ignore
    return !!process[Symbol.for("ts-node.register.instance")];
}