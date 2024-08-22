import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer';
import tw from '../../../Utils/tailwind-react-pdf'
import { getDateFromDateTimeToDisplay } from '../../../Utils/helper';
import commaNumber from 'comma-number';

const LedgerReportPrintFormat = ({ ledgerData, startDate, endDate }) => {
    const ledgerDetails = ledgerData?.data ? ledgerData.data : []
    // Calculate the total credit and debit amounts
    const totalCredit = ledgerDetails.filter(item => item.type === "Sales").reduce((total, entry) => total + Math.abs(entry.amount), 0);
    const totalDebit = ledgerDetails.filter(item => item.type === "Payment").reduce((total, entry) => total + Math.abs(entry.amount), 0);

    const openingBalance = ledgerData?.openingBalance;
    const closingBalance = ledgerData?.closingBalance;
    const partyName = ledgerData?.partyDetails?.name;
    const columnWidth = [
        5, 10, 15, 20, 20, 15, 15
    ];
    const columns = [
        { name: "S.No.", columnWidthPercentage: columnWidth[0], valueGetter: (entry, index) => index + 1, className: "text-center" },
        { name: "Date.", columnWidthPercentage: columnWidth[1], valueGetter: (entry, index) => getDateFromDateTimeToDisplay(entry.date) },
        { name: "Type.", columnWidthPercentage: columnWidth[2], valueGetter: (entry, index) => entry.type },
        { name: "Trans.Id.", columnWidthPercentage: columnWidth[3], valueGetter: (entry, index) => entry.transId },
        { name: "Payment Type / Ref.No.", columnWidthPercentage: columnWidth[4], valueGetter: (entry, index) => `${entry.paymentType}/${entry.paymentRefNo}`, totalsData: "Totals" },
        {
            name: "Credit", columnWidthPercentage: columnWidth[6], openingBalanceRow: "Open. Balance", openingBalanceStyle: "text-center", valueGetter: (entry, index) => entry.type === "Sales" ? commaNumber(Math.abs(entry.amount).toFixed(2)) : "", totalsData: commaNumber(Math.abs(totalCredit).toFixed(2)),
            closingBalanceData: "Closing Balance"
        },
        { name: "Debit", columnWidthPercentage: columnWidth[5], openingBalanceRow: parseFloat(openingBalance || 0).toFixed(2), openingBalanceStyle: "text-center", valueGetter: (entry, index) => entry.type === "Payment" ? commaNumber(Math.abs(entry.amount).toFixed(2)) : "", totalsData: commaNumber(Math.abs(totalDebit).toFixed(2)), closingBalanceData: parseFloat(closingBalance).toFixed(2) },
    ];
    return (
        <Document width={500} height={300} >
            <Page size="A4" style={{ fontFamily: "Times-Roman", ...tw("relative pb-[50px] px-2") }}>
                <View fixed>
                    <View style={tw("text-center mb-10 text-xl")}>
                        <Text style={{ fontFamily: "Times-Bold" }}>{partyName} Customer Ledger Report</Text>
                        <Text style={tw("text-sm")}>{getDateFromDateTimeToDisplay(startDate)} to {getDateFromDateTimeToDisplay(endDate)}</Text>
                    </View>
                    <View style={{ ...tw("w-full flex flex-row border-t border-l text-[11px]"), fontFamily: "Times-Bold" }}>
                        {columns.map((i) =>
                            <Text style={tw(`w-[${i.columnWidthPercentage}%] ${i.openingBalanceStyle} border-r p-1`)}>
                                {i.openingBalanceRow}
                            </Text>
                        )}
                    </View>
                    <View style={{ ...tw("w-full flex flex-row border-l border-t text-sm text-center"), fontFamily: "Times-Bold" }}>
                        {columns.map((i) =>
                            <Text style={tw(`w-[${i.columnWidthPercentage}%] border-r border-b  p-1`)}>
                                {i.name}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={tw("text-xs")}>
                    {
                        ledgerDetails.length > 0
                            ?
                            <>
                                {ledgerDetails.map((entry, index) => (
                                    <View key={index} style={tw(`w-full flex flex-row border-l border-b`)} wrap={false}>
                                        {columns.map((i) =>
                                            <Text style={tw(`w-[${i.columnWidthPercentage}%] ${i.openingBalanceStyle} ${i?.className} border-r p-1`)}>
                                                {i.valueGetter(entry, index)}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </>
                            :
                            <View style={tw(`w-full flex flex-row border-l border-b h-[20px]`)} wrap={false}>
                                {columns.map((i) =>
                                    <Text style={tw(`w-[${i.columnWidthPercentage}%] ${i.openingBalanceStyle} border-r p-1`)}>
                                    </Text>
                                )}
                            </View>
                    }
                    <View style={{ ...tw("w-full flex flex-row border-l border-b"), fontFamily: "Times-Bold" }}>
                        {columns.map((i) =>
                            <Text style={tw(`w-[${i.columnWidthPercentage}%] ${i.openingBalanceStyle} border-r p-1`)}>
                                {i.totalsData}
                            </Text>
                        )}
                    </View>
                    <View style={{ ...tw("w-full flex flex-row border-l border-b text-[11px]"), fontFamily: "Times-Bold" }}>
                        {columns.map((i) =>
                            <Text style={tw(`w-[${i.columnWidthPercentage}%] ${i.openingBalanceStyle} border-r p-1`)}>
                                {i.closingBalanceData}
                            </Text>
                        )}
                    </View>
                </View>
                <View fixed style={tw("absolute bottom-5")}>
                    <View style={tw("text-center w-full pb-1 pt-1 px-2 text-xs ")}>
                        <Text render={({ pageNumber, totalPages }) => (
                            `Page ${pageNumber} / ${totalPages}`
                        )} fixed />
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default LedgerReportPrintFormat