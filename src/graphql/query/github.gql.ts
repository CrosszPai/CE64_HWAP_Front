
import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { Repo } from 'src/global';

export const REPOS: TypedDocumentNode<{ repos: Repo[] }> = gql`
	query repos {
		repos {
			id
			name
		}
	}
`;
