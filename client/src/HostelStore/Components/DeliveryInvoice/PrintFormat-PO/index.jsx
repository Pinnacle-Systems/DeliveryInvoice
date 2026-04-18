
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import tw from "../../../../Utils/tailwind-react-pdf";
import { findFromList, getCommonParams, getDateFromDateTimeToDisplay } from "../../../../Utils/helper";
import TaxDetails from "./TaxDetails";
import { Loader } from "../../../../Basic/components";
import numberToText from "number-to-text";
import MsExports from "../../../../../src/assets/MSexports.png";
import numberToWords from "number-to-words";
import React from "react";

// Font registration
Font.register({
  family: "Roboto",
  src: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,600;1,400;1,600&display=swap",
});

const BORDER_GREY = "#9ca3af";
const ZEBRA_BROWN = "#F4EEE9";




const DeliveryInvoice = ({
  isTaxHookDetailsLoading,
  poDate,
  supplierDetails,
  poItems,
  discountType,
  discountValue,
  remarks,
  branchData,
  termsAndCondition,
  tax,
  colorList,
  uomList,
  yarnList,
  sizeList,
  term,
  termsData,
  useTaxDetailsHook,
  docId,
  totalQty,
  transportMode,
  transporter,
  vehicleNo
}) => {
  // Calculate GST summary
  const gstSummary = {};
  poItems?.filter(i => i.styleId)?.forEach(item => {
    const amount = item.invoiceQty * item.price;
    const tax = item?.Hsn?.tax;
    const halfGst = tax / 2;

    if (!gstSummary[tax]) {
      gstSummary[tax] = {
        cgstRate: halfGst,
        sgstRate: halfGst,
        cgstAmount: 0,
        sgstAmount: 0
      };
    }

    gstSummary[tax].cgstAmount += amount * (halfGst / 100);
    gstSummary[tax].sgstAmount += amount * (halfGst / 100);
  });

  const gstArray = Object.keys(gstSummary).map(tax => {
    return {
      taxRate: Number(tax),
      cgstRate: gstSummary[tax].cgstRate,
      sgstRate: gstSummary[tax].sgstRate,
      cgstAmount: gstSummary[tax].cgstAmount,
      sgstAmount: gstSummary[tax].sgstAmount,
      totalTax: gstSummary[tax].cgstAmount + gstSummary[tax].sgstAmount
    };
  });

  // Group PO items
  const groupedPoItems = Object.values(
    poItems.reduce((acc, item) => {
      const key = [
        item?.styleId,
        item?.styleItemId,
        item?.colorId,
        item?.uomId,
        item?.price,
      ].join("_");

      if (!acc[key]) {
        acc[key] = {
          ...item,
          invoiceQty: Number(item.invoiceQty) || 0,
        };
      } else {
        acc[key].invoiceQty += Number(item.invoiceQty) || 0;
      }

      return acc;
    }, {})
  );

  const totalAmount = poItems?.reduce((sum, item) => {
    const qty = Number(item?.invoiceQty ?? 0);
    const price = Number(item?.price ?? 0);
    return sum + qty * price;
  }, 0);

  // Calculate discount
  let discountAmount = 0;
  if (discountType == "Percentage") {
    discountAmount = (totalAmount * Number(discountValue || 0)) / 100;
  } else if (discountType == "Flat") {
    discountAmount = Number(discountValue || 0);
  }

  // Calculate tax totals
  const result = poItems?.filter(i => i.styleId)?.reduce(
    (acc, item) => {
      const amount = item.invoiceQty * item.price;
      const tax = item?.Hsn?.tax;
      const halfGst = tax / 2;

      const cgstAmount = amount * (halfGst / 100);
      const sgstAmount = amount * (halfGst / 100);
      const itemTax = cgstAmount + sgstAmount;

      acc.totalCgst += cgstAmount;
      acc.totalSgst += sgstAmount;
      acc.overallTax += itemTax;
      acc.subTotal += amount;

      return acc;
    },
    {
      totalCgst: 0,
      totalSgst: 0,
      overallTax: 0,
      subTotal: 0
    }
  );

  const netAmount = Math.max(totalAmount - discountAmount, 0) + (parseFloat(result?.totalSgst) + parseFloat(result?.totalCgst));
  const roundedNetAmount = Math.round(netAmount);
  const roundOff = Number((roundedNetAmount - netAmount).toFixed(2));
  const overallAmount = parseFloat(parseFloat(netAmount) + parseFloat(roundOff)).toFixed(2);

  // Chunk array for pagination
  const chunkArrayVariable = (arr, firstPageSize, otherPageSize) => {
    if (!arr || arr.length === 0) return [];

    const chunks = [];
    let startIndex = 0;

    // First page
    const firstChunk = arr.slice(0, firstPageSize);
    if (firstChunk.length > 0) {
      chunks.push(firstChunk);
      startIndex = firstPageSize;
    }

    // Remaining pages
    while (startIndex < arr.length) {
      chunks.push(arr.slice(startIndex, startIndex + otherPageSize));
      startIndex += otherPageSize;
    }

    return chunks;
  };

  const allRows = [...groupedPoItems];


  const chunks = chunkArrayVariable(allRows || [], 15, 25);


  const groupedByProcess = allRows.reduce((acc, item) => {
    const processId = item.processId;

    if (!acc[processId]) {
      acc[processId] = [];
    }

    acc[processId].push(item);

    return acc;
  }, {});


  const numberToIndianWords = (num) => {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const getTwoDigits = (n) => {
      if (n < 20) return ones[n];
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    };

    const getThreeDigits = (n) => {
      if (n >= 100) {
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + getTwoDigits(n % 100) : '');
      }
      return getTwoDigits(n);
    };

    let result = '';
    let crore = Math.floor(num / 10000000);
    let lakh = Math.floor((num % 10000000) / 100000);
    let thousand = Math.floor((num % 100000) / 1000);
    let remainder = num % 1000;

    if (crore > 0) result += getThreeDigits(crore) + ' Crore ';
    if (lakh > 0) result += getThreeDigits(lakh) + ' Lakh ';
    if (thousand > 0) result += getThreeDigits(thousand) + ' Thousand ';
    if (remainder > 0) result += getThreeDigits(remainder);

    return result.trim();
  };


  if (isTaxHookDetailsLoading) return <Loader />;

  const Header = () => (
    <>
      <Text style={styles.greenTitle}>TAX INVOICE</Text>
      <View style={styles.header}>
        <View style={{
          fontSize: 10,
          fontWeight: "bold",
          // marginBottom: 4,
          // marginTop: 4,
          flexDirection: 'row',
          width: '52%',
        }}>
          <Image source={MsExports} style={styles.logo} />
          <View style={{ width: 125, flexWrap: 'wrap' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: "extrabold",
              paddingVertical: 3,
              paddingHorizontal: 6,
              marginBottom: 2,
              marginTop: 5,
              textAlign: "left",
              color: "#000000"
            }}>
              {branchData?.branchName}
            </Text>
            <Text style={{
              fontSize: 9,
              marginBottom: 1,
              textAlign: "left",
              marginRight: 4,
              width: 170
            }}>{branchData?.address}</Text>

            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.companyText, { width: 40 }]}>Mobile</Text>
              <Text style={styles.companyText}>: {branchData?.contactMobile}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.companyText, { width: 40 }]}>Email</Text>
              <Text style={styles.companyText}>: {branchData?.contactEmail}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.companyText, { width: 40 }]}>GST No</Text>
              <Text style={styles.companyText}>: 33ALNPA8871B1Z9</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={{ alignItems: "flex-end", marginTop: 15, marginBottom: 3 }}>
            <View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>DATE</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.ValueText}>{getDateFromDateTimeToDisplay(poDate)}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>INVOICE NO</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.ValueText}>{docId}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>DELIVERY NOTE NO</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.ValueText}>NA</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>MODE OF TRANSPORT</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.ValueText}>{transportMode || "NA"}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>TRANSPORTER</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.ValueText}>{transporter || "NA"}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>VEHICLE NO</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.ValueText}>{vehicleNo || "NA"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 1 }}>
        {/* Bill To */}
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Bill To :</Text>
          <View style={{ padding: 6 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{
                fontWeight: "bold",
                paddingHorizontal: 2,
                color: "#000", marginTop: 1.5,
                fontSize: 8
              }}>M/s</Text>
              <Text style={{
                fontWeight: "bold",
                paddingHorizontal: 2,
                marginBottom: 4,
                color: "#000",
                fontSize: 10
              }}>
                {supplierDetails?.name}
              </Text>
            </View>
            <View style={{ paddingLeft: 7, width: 200 }}>
              <Text style={{
                fontSize: 9,
                textTransform: 'uppercase',
                lineHeight: 1.2,
                textAlign: 'left',
              }}>
                {supplierDetails?.address}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 4, paddingLeft: 7 }}>
              <Text style={[styles.companyText, { width: 70 }]}>Mobile No</Text>
              <Text style={styles.companyText}>: {supplierDetails?.contactMobile || "NA"}</Text>
            </View>
            <View style={{ flexDirection: "row", paddingLeft: 7 }}>
              <Text style={[styles.companyText, { width: 70 }]}>GST No</Text>
              <Text style={styles.companyText}>: {supplierDetails?.gstNo || 'NA'}</Text>
            </View>
            <View style={{ flexDirection: "row", paddingLeft: 7 }}>
              <Text style={[styles.companyText, { width: 70 }]}>Email</Text>
              <Text style={styles.companyText}>: {supplierDetails?.email || "NA"}</Text>
            </View>
          </View>
        </View>

        {/* Ship To */}
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Ship To :</Text>
          <View style={{ padding: 6 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{
                fontWeight: "bold",
                paddingHorizontal: 2,
                color: "#000", marginTop: 1.5,
                fontSize: 8
              }}>M/s</Text>              <Text style={{
                fontWeight: "bold",
                paddingHorizontal: 2,
                marginBottom: 4,
                color: "#000",
                fontSize: 10
              }}>
                {supplierDetails?.name}
              </Text>
            </View>
            <View style={{ paddingLeft: 7, width: 200 }}>
              <Text style={{
                fontSize: 9,
                textTransform: 'uppercase',
                lineHeight: 1.2,
                textAlign: 'left',
              }}>
                {supplierDetails?.address}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 4, paddingLeft: 7 }}>
              <Text style={[styles.companyText, { width: 70 }]}>Mobile No</Text>
              <Text style={styles.companyText}>: {supplierDetails?.contactMobile || "NA"}</Text>
            </View>
            <View style={{ flexDirection: "row", paddingLeft: 7 }}>
              <Text style={[styles.companyText, { width: 70 }]}>GST No</Text>
              <Text style={styles.companyText}>: {supplierDetails?.gstNo || "NA"}</Text>
            </View>
            <View style={{ flexDirection: "row", paddingLeft: 7 }}>
              <Text style={[styles.companyText, { width: 70 }]}>Email</Text>
              <Text style={styles.companyText}>: {supplierDetails?.email || "NA"}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
  const EmptyTableRow = ({ index }) => (
    <View
      key={`empty-row-${index}`}
      style={{
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        minHeight: 25, // important: keeps row height consistent
      }}
    >
      {[0.5, 9, 1, 1, 1.1, 1.1, 1.7].map((flex, i) => (
        <Text
          key={i}
          style={[
            styles.td,
            { flex, textAlign: i >= 6 ? "right" : "left" },
          ]}
        >
          {" "}
        </Text>
      ))}
    </View>
  );
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.th, { flex: 0.5 }]}>S.No</Text>
      <Text style={[styles.th, { flex: 9 }]}>Particulars</Text>
      {/* <Text style={[styles.th, { flex: 5 }]}>Process</Text> */}
      {/* <Text style={[styles.th, { flex: 4 }]}>Color</Text> */}
      <Text style={[styles.th, { flex: 1 }]}>Hsn</Text>
      <Text style={[styles.th, { flex: 1 }]}>Uom</Text>
      <Text style={[styles.th, { flex: 1.1 }]}>Qty</Text>
      <Text style={[styles.th, { flex: 1.1 }]}>Price</Text>
      <Text style={[styles.th, { flex: 1.7 }]}>Amount</Text>
    </View>
  );

  const TableRow = ({ row, index, absoluteIndex }) => (
    <View key={`row-${absoluteIndex}`} style={{
      flexDirection: "row",
      minHeight: 25
      // backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F4EEE9"
    }}>
      <Text style={[styles.td, { flex: 0.5 }]}>{absoluteIndex + 1}</Text>
      <Text style={[styles.td, { flex: 9, textAlign: "left" }]}>
        <Text style={{ fontWeight: "bold", color: "#000000" }}>
          Style Ref :  {row?.Style?.name} </Text> {"\n"}
        {row?.StyleItem?.name} ( {row?.Color?.name} ) -  {row?.Process?.name}

      </Text>
      {/* <Text style={[styles.td, { flex: 5, textAlign: "left" }]}>
        {row?.Process?.name}
      </Text> */}
      {/* <Text style={[styles.td, { flex: 4, textAlign: "left" }]}>
        {row?.Color?.name}
      </Text> */}
      <Text style={[styles.td, { flex: 1, textAlign: "center" }]}>
        {row?.Hsn?.name}
      </Text>
      <Text style={[styles.td, { flex: 1, textAlign: "left" }]}>
        {row?.Uom?.name}
      </Text>
      <Text style={[styles.td, { flex: 1.1, textAlign: "right" }]}>
        {row?.invoiceQty ? (Number(row?.invoiceQty)).toFixed(3) : ""}
      </Text>
      <Text style={[styles.td, { flex: 1.1, textAlign: "right" }]}>
        {row?.price ? (Number(row?.price)).toFixed(2) : ""}
      </Text>
      <Text style={[styles.td, { flex: 1.7, textAlign: "right" }]}>
        {row?.invoiceQty * row?.price ? (
          (Number(row?.invoiceQty) || 0) *
          (Number(row?.price) || 0)
        ).toFixed(2) : ''}
      </Text>
    </View>
  );

  const TableTotalRow = () => (
    <View style={{ flexDirection: "row", backgroundColor: "#946657", }}>
      <Text style={[{ flex: 1, padding: 3 }]}></Text>
      <Text style={[{ flex: 5, padding: 3 }]}></Text>
      <Text style={[{
        flex: 4,
        padding: 3,
        fontSize: 8,
        color: "white"
      }]}>
        Total
      </Text>
      <Text style={[{ flex: 4, padding: 3 }]}></Text>
      <Text style={[{ flex: 1, padding: 3 }]}></Text>
      <Text style={[{
        flex: 1,
        borderRight: "1 solid ",
        padding: 3,
        borderRightColor: BORDER_GREY
      }]}></Text>
      <Text style={[{
        flex: 2,
        textAlign: "right",
        fontSize: 8,
        borderRight: "1 solid ",
        padding: 3,
        color: "white",
        borderRightColor: BORDER_GREY
      }]}>
        {parseFloat(totalQty).toFixed(3)}
      </Text>
      <Text style={[{
        flex: 2,
        borderRight: "1 solid ",
        padding: 3,
        borderRightColor: BORDER_GREY
      }]}></Text>
      <Text style={[{
        flex: 2.5,
        textAlign: "right",
        fontSize: 8,
        borderRight: "1 solid ",
        padding: 3,
        color: "white",
        borderRightColor: BORDER_GREY
      }]}>
        {parseFloat(totalAmount).toFixed(2)}
      </Text>
    </View>
  );

  const SummarySection = () => (
    <>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#9ca3af",
          width: "100%",
          marginTop: 4,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* Left Side - Bank Details */}
        <View
          style={{
            width: "45%",
            marginRight: 140,
            borderRightWidth: 1,
            borderColor: "#9ca3af",
          }}
        >
          {[
            ["Bank Name", "IDBI BANK"],
            ["A/C No", "1622651100000897"],
            ["Branch", "Palladam Road Veerapandi Privu, Tirupur-5"],
            ["IFSC Code", "IBKL0001622"],
          ].map(([label, value], index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                borderBottomWidth: index !== 3 ? 1 : 0,
                borderColor: "#9ca3af",
              }}
            >
              <Text
                style={{
                  width: 80,
                  fontSize: 8,
                  padding: 4,
                  fontWeight: "bold",
                  backgroundColor: "#f0f4ff",
                  borderRightWidth: 1,
                  borderColor: "#9ca3af",
                }}
              >
                {label}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 8,
                  padding: 4,
                }}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>

        <View style={{
          flex: 1, padding: 1, width: "35%",
        }}>
          <View style={{
            flexDirection: "row", padding: 2, borderLeftWidth: 1,
            borderColor: "#9ca3af",
          }}>
            <Text style={{ flex: 2, fontSize: 8 }}>Taxable Amount</Text>
            <Text style={{ flex: 1, textAlign: "right", fontSize: 8 }}>
              {Number(totalAmount || 0).toFixed(2)}
            </Text>
          </View>

          {gstArray?.map((item, index) => (
            <React.Fragment key={index}>
              <View
                style={{
                  flexDirection: "row",
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderColor: "#9ca3af",
                  // marginTop: 2,
                  padding: 2,

                }}
              >
                <Text style={{ flex: 2, fontSize: 8 }}>
                  CGST @{item.cgstRate}%
                </Text>
                <Text style={{ flex: 1, textAlign: "right", fontSize: 8 }}>
                  {Number(item.cgstAmount || 0).toFixed(2)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  borderTopWidth: 1,
                  borderColor: "#9ca3af",
                  borderLeftWidth: 1,

                }}
              >
                <Text style={{ flex: 2, fontSize: 8 }}>
                  SGST @{item.sgstRate}%
                </Text>
                <Text style={{ flex: 1, textAlign: "right", fontSize: 8 }}>
                  {Number(item.sgstAmount || 0).toFixed(2)}
                </Text>
              </View>
            </React.Fragment>
          ))}

          <View
            style={{
              flexDirection: "row",
              borderTopWidth: 1,
              borderColor: "#9ca3af",
              // marginTop: 2,
              padding: 2,
              borderLeftWidth: 1,

            }}
          >
            <Text style={{ flex: 2, fontSize: 8 }}>Round Off</Text>
            <Text style={{ flex: 1, textAlign: "right", fontSize: 8 }}>
              {Number(roundOff || 0).toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderTopWidth: 1,
              borderColor: "#9ca3af",
              backgroundColor: "#946657",
              padding: 2,
              marginTop: 2,
            }}
          >
            <Text style={{ flex: 1, fontSize: 10, color: "#FFFFFF" }}>
              Net Amount in Rs
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "right",
                fontSize: 10,
                color: "#FFFFFF",
              }}
            >
              {Number(overallAmount || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>{console.log(Math.round(overallAmount), "amount in words")}
      <View style={{ backgroundColor: "", paddingVertical: 5, paddingHorizontal: 6, marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontWeight: "bold", color: "", flexWrap: "wrap" }}>
          {/* Amount in Words: Rs. {numberToWords.toWords(
            (overallAmount) ? Math.round(overallAmount) : 0
          )} Only */}
          Amount in Words: Rs. {numberToIndianWords(
            (overallAmount) ? Math.round(overallAmount) : 0
          )} Only
        </Text>
      </View>
      <View style={{ borderBottom: "1 solid #9ca3af", backgroundColor: "#946657", paddingVertical: 5, paddingHorizontal: 6, marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontWeight: "bold", color: "#FFFFFF", flexWrap: "wrap" }}>
          Certified that the particulars given above are true and correct
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 40,
          borderBottom: "1 solid #9ca3af"
        }}
      >
        <View
          style={{
            flex: 0.3,
            borderRight: "1 solid #9ca3af",
            backgroundColor: "#f0f4ff",
            paddingVertical: 5,
            paddingHorizontal: 6,
            minHeight: 40,
            width: 40

          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              color: "#000",
              flexWrap: "wrap"
            }}
          >
            Remarks:
          </Text>
          <Text style={{ fontSize: 8, flexWrap: "wrap" }}>
            {remarks || ""}
          </Text>
        </View>


        <View
          style={{
            flex: 0.7,
            paddingVertical: 5,
            paddingHorizontal: 6,
            minHeight: 40,
            width: 100

          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontWeight: "bold",
              color: "#000",
              flexWrap: "wrap",
            }}
          >
            Terms & Conditions:
          </Text>
          <Text style={{ fontSize: 8, flexWrap: "wrap" }}>
            {/* {term || "—"}
                        */}
            {/* {findFromList(term, termsData?.data, "termsAndCondition")} */}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 45 }}>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {["Prepared By", "Verified By", "Received By", "Approved By"].map(
            (role) => (
              <Text
                key={role}
                style={{
                  fontSize: 8,
                  textAlign: "center",
                  fontWeight: "bold",
                  flex: 1,
                }}
              >
                {role}
              </Text>
            )
          )}
        </View>
      </View>
    </>
  );

  let globalIndex = 0;


  return (
    <Document>
      {chunks.map((chunk, pageIndex) => {
        const isLastPage = pageIndex === chunks.length - 1;
        const isFirstPage = pageIndex === 0;

        return (
          <Page key={`page-${pageIndex}`} size="A4" style={styles.page}>
            <View style={styles.pageBorder}>
              {isFirstPage && <Header />}

              <TableHeader />

              {chunk.map((row, rowIndex) => {
                const absoluteIndex = (() => {
                  let index = rowIndex;
                  for (let i = 0; i < pageIndex; i++) {
                    index += chunks[i].length;
                  }
                  return index;
                })();

                return (
                  <TableRow
                    key={`row-${pageIndex}-${rowIndex}`}
                    row={row}
                    index={rowIndex}
                    absoluteIndex={absoluteIndex}
                  />
                );
              })}
              {pageIndex === 0 &&
                chunk.length < 9 &&
                Array.from({ length: 9 - chunk.length }).map((_, i) => (
                  <EmptyTableRow key={`filler-${i}`} index={i} />
                ))}

              {isLastPage && <TableTotalRow />}
              {isLastPage && (
                <View wrap={false}>
                  <SummarySection />
                </View>
              )}
            </View>


            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={styles.pageNumber}
                render={({ pageNumber }) => `${pageNumber}`}
                fixed
              />
            </View>

          </Page>
        );
      })}


    </Document>
  );
};


const styles = StyleSheet.create({
  page: {
    padding: 10,
  },

  pageBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#9ca3af",
    paddingTop: 5,
    paddingBottom: 1,
  },
  borderWrapper: {
    borderWidth: 1,
    borderColor: "#9ca3af",
    minHeight: "100%",
    width: "100%",
    padding: 8,
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    // marginBottom: 7,
    flexDirection: "row",
    // padding: 7,
    // paddingHorizontal : 7,
    // paddingVertical : 3 ,
    height: 100
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 12,
  },
  companyText: {
    fontSize: 9,
    marginBottom: 1,
    textAlign: "left",
    marginRight: 4,
  },
  ValueText: {
    fontSize: 9,
    marginBottom: 1,
    paddingLeft: 4,
  },
  greenTitle: {
    textAlign: "center",
    fontSize: 15,
    color: "#FFFF",
    backgroundColor: "#946657",
    paddingVertical: 4,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFF",
    backgroundColor: "#946657",
    padding: 3,
    marginBottom: 0
  },
  valueContainer: {
    flexDirection: 'row',
    paddingLeft: 6,
  },
  colon: {
    fontSize: 9,
  },
  tableHeader: {
    flexDirection: "row",
    borderTop: "1 solid #000",
    borderBottom: "1 solid #000",
    marginTop: 6,
    backgroundColor: "#946657",
    padding: 3,
    color: "#FFFF"
  },
  th: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    padding: 3,
  },
  td: {
    // flex: 1,
    fontSize: 8,
    textAlign: "center",
    alignContent: "center",
    // alignSelf : "center",
    borderRightWidth: 1,
    // borderBottomWidth: 1,
    borderRightColor: BORDER_GREY,
    // borderBottomColor: BORDER_GREY,
    padding: 3,
  },
  taxBox: {
    width: 180,
    border: "1 solid #000",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 30,
    fontSize: 7,
    color: "#555",
  },
});
export default DeliveryInvoice;