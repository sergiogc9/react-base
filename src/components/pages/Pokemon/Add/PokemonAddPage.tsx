import React from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { capitalize } from 'lib/imports/lodash';
import { Flex, Grid, Select, Title } from '@sergiogc9/react-ui';

import Form from 'components/common/Form';
import { useAddPokemon } from 'queries/pokemon';
import { pokemonTypes } from 'types/entities/pokemon';

import { PokemonAddFormValues } from './types';

const PokemonItemPage: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const { mutateAsync: addPokemon } = useAddPokemon();

	const defaultValues = React.useMemo<Partial<PokemonAddFormValues>>(
		() => ({
			baseExperience: 0,
			description: '',
			name: ''
		}),
		[]
	);

	const onFormSubmit = React.useCallback(
		async (values: PokemonAddFormValues) => {
			await addPokemon({ pokemonData: values });
		},
		[addPokemon]
	);

	const validationSchema = React.useMemo(
		() =>
			Yup.object({
				baseExperience: Yup.number().min(0).required(t('form.error.input_required')),
				description: Yup.string().required(t('form.error.input_required')),
				name: Yup.string().required(t('form.error.input_required')),
				type: Yup.string().oneOf(pokemonTypes).required(t('form.error.input_required'))
			}),
		[t]
	);

	return (
		<Flex alignItems="center" flexDirection="column" id="pokemonAddPage" width="100%">
			<Helmet>
				<title>Add new pokemon</title>
			</Helmet>
			<Title aspectSize="l">Add new pokemon</Title>
			<Form defaultValues={defaultValues} onSubmit={onFormSubmit} validationSchema={validationSchema}>
				<Grid
					columns={12}
					margin="0 auto"
					mt={5}
					maxWidth={{ xs: 'auto', lg: 500 }}
					rowGap={2}
					px={3}
					width={{ xs: '100%', md: '75%', lg: '50%' }}
				>
					<Grid.Box columns={{ xs: 12, md: 6 }}>
						<Form.TextField name="name" label="Name" />
					</Grid.Box>
					<Grid.Box columns={{ xs: 12, md: 6 }}>
						<Form.TextField name="baseExperience" label="Experience" type="number" />
					</Grid.Box>
					<Grid.Row>
						<Form.Select name="type" label="Type">
							{pokemonTypes.map(type => (
								<Select.Option id={type} key={type}>
									{capitalize(type)}
								</Select.Option>
							))}
						</Form.Select>
					</Grid.Row>
					<Grid.Row>
						<Form.TextArea name="description" label="Description" />
					</Grid.Row>
					<Grid.Box columns={6}>
						<Form.ButtonCancel onClick={() => navigate('/pokemon')} width="100%">
							{t('form.buttons.cancel')}
						</Form.ButtonCancel>
					</Grid.Box>
					<Grid.Box columns={6}>
						<Form.ButtonSubmit width="100%">{t('form.buttons.save')}</Form.ButtonSubmit>
					</Grid.Box>
				</Grid>
			</Form>
		</Flex>
	);
};

export default React.memo(PokemonItemPage);
