import * as lp from 'it-length-prefixed';
import map from 'it-map';
import { pipe } from 'it-pipe';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';

export function stdinToStream(stream) {
    process.stdin.setEncoding('utf8');
    pipe(
        process.stdin,
        source => map(source, string => uint8ArrayFromString(string)),
        source => lp.encode(source),
        stream.sink
    );
}

export function streamToConsole(stream) {
    pipe(
        stream.source,
        source => lp.decode(source),
        source => map(source, buf => uint8ArrayToString(buf.subarray())),
        async function(source) {
            for await (const msg of source) {
                console.log('\x1b[36m%s\x1b[0m', '> ' + msg.toString().replace('\n', ''));
            }
        }
    );
}
