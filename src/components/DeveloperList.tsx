import React from 'react';
import { Developer } from '../types/developer';
import DeveloperListItem from './DeveloperListItem';
import { IonList } from '@ionic/react';

interface Props {
  developers: Developer[];
  onUpdate: (dev: Developer) => void;
  onDelete: (id: number) => void;
}

const DeveloperList: React.FC<Props> = ({ developers, onDelete, onUpdate }) => {
  return (
    <IonList className="space-y-4 p-4">
      {developers.map((dev) => (
        <DeveloperListItem
          key={dev.id}
          developer={dev}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </IonList>
  );
};

export default DeveloperList;