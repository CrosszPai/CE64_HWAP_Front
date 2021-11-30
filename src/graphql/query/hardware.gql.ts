import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { Hardware } from 'src/global';

export const HARDWARES: TypedDocumentNode<{ hardwares: Hardware[] }> = gql`
	query hardwares {
		hardwares {
			id
			status
			queue {
				id
				working {
					id
				}
			}
			created_at
		}
	}
`;
