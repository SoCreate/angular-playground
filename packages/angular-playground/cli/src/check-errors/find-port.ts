import getPort from 'get-port';

/**
 * Function that detects the first port not in use in a given range
 * e.g.
 *   findFirstFreePort('127.0.0.1', 8000, 8030, (port) => {
 *       console.log(port)
 *   });
 *
 */
export async function findFirstFreePort(host: string, start: number, end: number): Promise<number> {
    const ports: number[] = [];
    for (let i = start; i < end; i++) {
        ports.push(i);
    }
    const port = await getPort({ port: ports, host });
    return port;
}
