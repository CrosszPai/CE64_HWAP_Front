import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { Working } from 'src/global';

export const WORKING: TypedDocumentNode<{ getSelfWorking: Working[] }> = gql`
	query getSelfWorking {
		getSelfWorking {
			id
			lab {
				id
				lab_name
				lab_detail
			}
			repo_url
			queue {
				id
				status
			}
		}
	}
`;

export const ALL_WORKINGS: TypedDocumentNode<{ getAllWorking: Working[] }> = gql`
	query getAllWorking {
		getAllWorking {
			id
			lab {
				id
				lab_name
			}
			repo_url
			created_at
			owner {
				name
			}
			queue {
				id
				status
			}
		}
	}
`;
