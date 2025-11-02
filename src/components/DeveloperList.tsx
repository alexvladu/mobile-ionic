import React, { useEffect, useState } from 'react';
import { Developer } from '../types/developer';
import DeveloperListItem from './DeveloperListItem';
import { IonList, IonButton, IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

interface Props {
  developers: Developer[];
  onUpdate: (dev: Developer) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  total: number | null;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

const DeveloperList: React.FC<Props> = ({
  developers,
  onDelete,
  onUpdate,
  currentPage,
  total,
  pageSize,
  onPageChange,
}) => {
  const totalPages = total ? Math.ceil(total / pageSize) : 1;
  const [visibleDevelopers, setVisibleDevelopers] = useState<Developer[]>(
    () => developers.slice(0, pageSize)
  );

  useEffect(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    setVisibleDevelopers(developers.slice(start, end));
  }, [developers, currentPage, pageSize, total, totalPages, onPageChange]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <IonList className="space-y-4">
        {visibleDevelopers.map((dev) => (
          <DeveloperListItem
            key={dev.id}
            developer={dev}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </IonList>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <IonButton
            fill="clear"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>

          <IonButton
            fill="clear"
            disabled={currentPage + 1 >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default DeveloperList;
