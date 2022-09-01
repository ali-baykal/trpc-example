import { Form, Link } from '@remix-run/react';
import type { PersistedTranslation } from 'model/dist/Translation';
import { ChangeEvent, useCallback, useState } from 'react';

interface Props {
    translations: PersistedTranslation[],
    editedId?: number
}

const createChangeHanler = (callback: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.value;
    callback(value);
}

const EditRow: React.FC<{ translation: PersistedTranslation }> = props => {
    const { translation } = props;
    const [originalValue, setOriginalValue] = useState(translation.original);
    const [translationValue, setTranslationValue] = useState(translation.translation);
    const onOriginalChange = useCallback(createChangeHanler(setOriginalValue), [setOriginalValue]);
    const onTranslationChange = useCallback(createChangeHanler(setTranslationValue), [setTranslationValue]);

    return (
        <tr key={translation.id}>
            <td className='p-1'><input value={originalValue} name="original" onChange={onOriginalChange}/></td>
            <td className='p-1'><input value={translationValue} name="translation" onChange={onTranslationChange}/></td>
            <td className='p-1'><button>Save</button></td>
        </tr>
    );
}


const ReadRow: React.FC<{ translation: PersistedTranslation, edited: boolean }> = props => {
    const { translation, edited } = props;


    return (
        <tr key={translation.id}>
            <td className='p-1'>{translation.original}</td>
            <td className='p-1'>{translation.translation}</td>
            <td className='p-1'>{
                edited
                    ? null
                    : <Link to={`/edit/${translation.id}`}>Edit</Link>
            }</td>
        </tr>
    );
}

const TranslationTableContent: React.FC<Props & {edited: boolean}> = (props) => {
    const { translations, editedId, edited } = props;

    return (
        <div className='max-h-screen overflow-x-auto m-0 p-1'>
            <table className='table-fixed relative'>
                <thead className='sticky'>
                    <tr>
                        <th className='text-left p-1'>De</th>
                        <th className='text-left p-1'>Tr</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        translations.map(
                            translation => (
                                edited && translation.id === editedId
                                    ? <EditRow translation={translation} key={translation.id} />
                                    : <ReadRow translation={translation} edited={edited} key={translation.id} />
                            )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}


const TranslationTable: React.FC<Props> = (props) => {
    const { translations, editedId } = props;
    const edited = typeof editedId === 'number';
    const content = <TranslationTableContent translations={translations} edited={edited} editedId={editedId}/>;
    return (
        edited
            ? <Form action={`/save/${editedId}`} method='post'>{content}</Form>
            : content
    )
}

export default TranslationTable;
