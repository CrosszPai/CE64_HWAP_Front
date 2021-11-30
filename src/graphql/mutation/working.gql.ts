import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { Lab } from 'src/global';

export const ADD_WORKING: TypedDocumentNode<
	{ addWorking: Lab },
	{ lab: string; repo: string }
> = gql`
	mutation addWorking($lab: String!, $repo: String!) {
		addWorking(lab: $lab, repo: $repo) {
			lab {
				lab_name
			}
			repo_url
			owner {
				id
			}
		}
	}
`;
