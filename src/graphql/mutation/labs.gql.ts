import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { lab } from 'src/global';

export const CREATE_LAB: TypedDocumentNode<
	{ createLab: lab },
	{ lab_name: string; lab_detail?: string }
> = gql`
	mutation createLab($lab_name: String!, $lab_detail: String) {
		createLab(lab_name: $lab_name, lab_detail: $lab_detail) {
			lab_name
			lab_detail
		}
	}
`;
