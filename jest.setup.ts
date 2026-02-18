import "@testing-library/jest-dom";
import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });