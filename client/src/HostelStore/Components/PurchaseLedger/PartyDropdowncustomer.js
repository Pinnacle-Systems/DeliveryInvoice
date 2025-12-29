import React from 'react';
import { DropdownWithSearch } from '../../../Inputs';
import { getCommonParams } from '../../../Utils/helper';
import { useGetPartyQuery } from '../../../redux/services/PartyMasterService';

const PartyDropdownSearchCus = ({ readOnly, name, selected, setSelected, id }) => {
    const { token, ...params } = getCommonParams();
    const { data: partyList } = useGetPartyQuery({ params: { ...params } });

    return (
        <div className='flex flex-col text-xs  h-10'>
            <label className=' border-r pl-1 block text-xs font-bold text-gray-600 mb-1'>{name}</label>
            <div className='col-span-4 z-40 w-full'>
                <DropdownWithSearch 
                    key={selected} 
                    value={selected} 
                    className='h-32'
                    readOnly={readOnly}
                    setValue={(value) => setSelected(value)}
                    options={(partyList?.data || []).filter(item => 
                        id ? true : (item?.active && item?.isCustomer === true)
                    )}
                />
            </div>
        </div>
    );
};

export { PartyDropdownSearchCus };