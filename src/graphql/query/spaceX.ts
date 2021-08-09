import { gql } from '@urql/svelte';

export const TEST_SPACE_X = gql`
	{
		launchesPast(limit: 1) {
			mission_name
			launch_date_local
			launch_site {
				site_name_long
			}
			links {
				article_link
				video_link
			}
		}
	}
`;
