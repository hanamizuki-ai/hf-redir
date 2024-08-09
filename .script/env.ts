import {env} from 'node:process'

export const HF_TOKEN = env?.HF_TOKEN as string;
