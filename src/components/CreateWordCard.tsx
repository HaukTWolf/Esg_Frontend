import type { FormEvent } from 'react';
import { languageOptions } from '../data/languages';
import type { SingleEntryFormValues } from '../types';
import Button from './Button';
import SelectInput from './SelectInput';
import TextInput from './TextInput';

interface CreateWordCardProps {
  values: SingleEntryFormValues;
  isSubmitting: boolean;
  onChange: <Field extends keyof SingleEntryFormValues>(
    field: Field,
    value: SingleEntryFormValues[Field]
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
}

function CreateWordCard({ values, isSubmitting, onChange, onSubmit }: CreateWordCardProps) {
  const sourceOptions = languageOptions.filter((option) => option.value !== values.targetLang);
  const targetOptions = languageOptions.filter((option) => option.value !== values.sourceLang);

  return (
    <section className="card">
      <div className="card-header">
        <p className="section-label">Eingabe</p>
        <h2 className="section-title">Neues Wort eingeben</h2>
        <p className="section-hint">
          Gib ein Wort ein. Die Uebersetzung wird danach automatisch erstellt. Das Thema ist
          optional.
        </p>
      </div>

      <form className="create-word-card-form" onSubmit={onSubmit}>
        <SelectInput
          label="Sprache vom Wort"
          value={values.sourceLang}
          onChange={(event) => onChange('sourceLang', event.target.value)}
          options={sourceOptions}
        />

        <SelectInput
          label="Sprache der Uebersetzung"
          value={values.targetLang}
          onChange={(event) => onChange('targetLang', event.target.value)}
          options={targetOptions}
        />

        <TextInput
          required
          label="Begriff"
          value={values.key}
          onChange={(event) => onChange('key', event.target.value)}
          placeholder="z. B. Arbeit"
        />

        <TextInput
          label="Thema (optional)"
          value={values.domain}
          onChange={(event) => onChange('domain', event.target.value)}
          placeholder="z. B. Schule"
        />

        <div className="create-word-card-submit">
          <Button fullWidth type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Erzeuge...' : 'Vokabel erzeugen'}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default CreateWordCard;
