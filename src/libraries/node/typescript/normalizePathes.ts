import { join } from 'path';
import { AliasOptions } from 'vite';

type TsconfigFile = { compilerOptions: { paths: Record<string, string[]> }};

export const normalizePathes = (
  pathes: Required<Required<TsconfigFile>['compilerOptions']>['paths'] = {},
  prefix = '',
): AliasOptions => {
  const result: Record<string, string> = {};
  const aliases = pathes;
  
  Object.keys(aliases).forEach((alias) => {
    const normalized = alias
      .replace(/\/\*$/, '')
      .trim();

    if (!normalized) {
      return;
    }

    const paths = [aliases[alias]].flat(2);
    if (paths.length > 0) {
      const firstPath = paths[0].replace(/\/\*$/, '').trim();
      result[normalized] = join(prefix, firstPath);
    }
  });
  
  return result;
};