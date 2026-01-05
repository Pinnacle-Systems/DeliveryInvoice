

import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
// import Sangeethatex from "../../../../../src/assets/Sangeethatex.png";
import tw from "../../../../Utils/tailwind-react-pdf";
import { findFromList, getCommonParams, getDateFromDateTimeToDisplay } from "../../../../Utils/helper";

import TaxDetails from "./TaxDetails";
import { Loader } from "../../../../Basic/components";
import numberToText from "number-to-text";
import MsExports from "../../../../../src/assets/MSexports.png";
import numberToWords from "number-to-words";
// Font registration
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf" }, // normal
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});
Font.registerHyphenationCallback(word => [word]);
const BORDER_GREY = "#9ca3af";
const ZEBRA_BROWN = "#F4EEE9";
export const styles = StyleSheet.create({
  borderBox: {
    borderWidth: 1,
    borderColor: BORDER_GREY,
    margin: 0,
    padding: 8,
  },

  page: {
    fontSize: 8,
    padding: 0,
    borderWidth: 1,
    borderColor: BORDER_GREY,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-center",
    paddingHorizontal: 1,
    height: 70,
    borderBottomColor: BORDER_GREY,
    borderBottomWidth: 1
  },

  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 12,
  },

  companyText: {
    fontSize: 8,
    marginBottom: 1,
    textAlign: "left",
    marginRight: 1,
  },

  ValueText: {
    fontSize: 9,
    paddingLeft: 2,
  },

  greenTitle: {
    alignSelf: "flex-end",
    fontFamily: "Roboto",
    fontSize: 13,
    color: "#8B0000",
    fontWeight: "bold",
    paddingVertical: 4,
    paddingRight: 5,
    width: "100%",
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GREY,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#946A52",
    paddingHorizontal: 6,
    paddingVertical:3,
    color: "white",
    height:20,
    alignItems:"center",
    display:"flex"
  },

  valueContainer: {
    flexDirection: "row",
    paddingLeft: 6,
  },

  colon: {
    fontSize: 9,
  },

  boxContent: {
    padding: 3,
    paddingRight:10,
    fontSize: 8,
    // borderWidth: 1,
    // borderColor: BORDER_GREY,
  },

  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: BORDER_GREY,
    borderBottomColor: BORDER_GREY,
    backgroundColor: "#946A52",
    padding: 3,
  },

  th: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    padding: 3,
    color: "white"
  },

  td: {
    flex: 1,
    fontSize: 8,
    textAlign: "center",
    padding: 3,

    // ✅ GREY GRID
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: BORDER_GREY,
    borderBottomColor: BORDER_GREY,
  },

  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BORDER_GREY,
  },

  totalLabel: {
    flex: 8,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
    padding: 3,
  },

  totalValue: {
    flex: 1.2,
    textAlign: "right",
    fontSize: 8,
    padding: 3,
  },

  taxBox: {
    width: 180,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    alignSelf: "flex-end",
    marginTop: 4,
  },

  taxRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BORDER_GREY,
  },

  taxLabel: {
    flex: 1,
    padding: 3,
    fontSize: 8,
  },

  taxValue: {
    flex: 1,
    textAlign: "right",
    padding: 3,
    fontSize: 8,
  },

  footer: {
    marginTop: 10,
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  signature: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 8,
  },

  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 30,
    fontSize: 7,
    color: "#555",
  },
});
const DeliveryChallanPrint = ({
  isTaxHookDetailsLoading,
  poNumber,
  poDate,
  deliveryToId,
  dueDate,
  payTermId,
  deliveryType,
  supplierDetails,
  poItems,
  taxTemplateId,
  discountType,
  discountValue,
  remarks,
  poType,
  branchData,
  termsAndCondition,
  // taxDetails,
  deliveryTo,
  tax,
  taxGroupWise,
  colorList, uomList, yarnList, sizeList, term, termsData, useTaxDetailsHook, docId, totalQty,
  transportMode, transporter, vehicleNo, deliveryItems

}) => {

  console.log(branchData, "branchDataaa")


  // const groupedPoItems = Object.values(
  //   poItems.reduce((acc, item) => {
  //     const key = [
  //       item?.styleId,
  //       item?.styleItemsId,
  //       item?.colorId,
  //       item?.uomId,
  //       item?.price,
  //     ].join("_");

  //     if (!acc[key]) {
  //       acc[key] = {
  //         ...item,
  //         invoiceQty: Number(item.invoiceQty) || 0,
  //       };
  //     } else {
  //       acc[key].invoiceQty += Number(item.invoiceQty) || 0;
  //     }

  //     return acc;
  //   }, {})
  // );




  const filledPoItems = [
    ...deliveryItems,
    ...Array(Math.max(0, 15 - deliveryItems.length)).fill({}), // empty rows
  ];


  const taxKey = tax           // GST %
  // const isInterState = party?.isOutsideState == true;
  const isInterState = false;

  // const totalAmount = filledPoItems?.reduce((sum, item) => {
  //   const qty = Number(item.invoiceQty || 0);
  //   const price = Number(item.price || 0);
  //   return sum + qty * price;
  // }, 0);


  const gstPercent = Number(taxKey) || 0;
  const halfGST = gstPercent / 2;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  // if (isInterState) {
  //   igstAmount = (totalAmount * gstPercent) / 100;
  // } else {
  //   cgstAmount = (totalAmount * halfGST) / 100;
  //   sgstAmount = (totalAmount * halfGST) / 100;
  // }

  // gross before rounding
  // const grossAmount = totalAmount + cgstAmount + sgstAmount + igstAmount;

  // // rounding logic
  // const roundedNetAmount = Math.round(grossAmount);
  // const roundOffAmount = +(roundedNetAmount - grossAmount).toFixed(2);



  if (isTaxHookDetailsLoading) return <Loader />

  const labelStyle = {
    width: 90,
    fontSize: 8,
    padding: 4,
    fontWeight: "bold",
    backgroundColor: "#f0f4ff",
    borderRight: "1 solid #9ca3af",
  };

  const valueStyle = {
    flex: 1,
    fontSize: 8,
    padding: 4,
    textAlign: "left",
    flexWrap: "wrap",
  };

  return (
    <Document>
      <Page size="A4" style={styles.borderBox}>
        <View style={styles.page} >
          <Text style={styles.greenTitle}>DELIVERY CHALLAN</Text>

          <View style={styles.header}>
            <Image source={MsExports} style={styles.logo} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>

              {/* <Text
                style={{
                  fontSize: 14,
                  marginBottom: 2,
                  marginTop: 5,
                  textAlign: "right",
                  color: "#000000",
                  paddingRight: 5,
                }}
              >
                {branchData?.branchName}
              </Text> */}

              <Text style={{
                fontSize: 8,
                marginBottom: 1,
                textAlign: "right",
                marginRight: 1,
                width: 200,
                paddingRight: 5,
                marginTop: 12,
              }}>{branchData?.address}</Text>
              <View style={{ flexDirection: 'row', paddingRight: 2 }}>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.companyText]}>GST NO</Text>
                  <Text style={styles.companyText}>: 33ALNPA8871B1Z9 /</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.companyText]}>CONTACT</Text>
                  <Text style={styles.companyText}>: {branchData?.contactMobile}</Text>
                </View>
              </View>


              <View style={{ flexDirection: 'row', paddingRight: 2 }}>
                <Text style={[styles.companyText]}>EMAIL</Text>
                <Text style={styles.companyText}>: {branchData?.contactEmail}</Text>
              </View>
            </View>
          </View>



          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>

            <View style={{ flex: 1, borderRightWidth: 1, borderColor: BORDER_GREY,paddingBottom:6 }}>
              <Text style={styles.sectionTitle}>DELIVERY TO :</Text>
              <View style={styles.boxContent}>
                <View style={{
                  flexDirection: "row",
                  marginTop: 5
                }}>
                  {/* <Text style={{
                    marginTop: 1
                  }} >M/s</Text> */}

                  <Text style={{
                    fontWeight: "bold",
                    paddingHorizontal: 1,
                    marginBottom: 2,
                    fontSize: 10
                  }}>
                    {supplierDetails?.name}
                  </Text>
                </View>



                <View style={{
                  paddingLeft: 2,
                  width: 200,
                  marginBottom: 1
                }}>
                  <Text style={{
                    fontSize: 8,
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                    textAlign: 'left',
                  }}>
                    {supplierDetails?.address}
                  </Text>
                </View>


                <View style={{ flexDirection: "row", marginTop: 1, paddingLeft: 2, marginBottom: 1 }}>
                  <Text style={[styles.companyText, { width: 40 }]}>CONTACT</Text>
                  <Text style={styles.companyText}>: {supplierDetails?.contactNumber ? supplierDetails?.contactNumber : ""}</Text>
                </View>


                <View style={{ flexDirection: "row", paddingLeft: 2, marginBottom: 1 }}>
                  <Text style={[styles.companyText, { width: 40 }]}>GST NO</Text>
                  <Text style={styles.companyText}>: {supplierDetails?.gstNo}</Text>
                </View>

                <View style={{ flexDirection: "row", paddingLeft: 2, }}>
                  <Text style={[styles.companyText, { width: 40 }]}>EMAIL</Text>
                  <Text style={styles.companyText}>: {supplierDetails?.contactPersonEmail}</Text>
                </View>
              </View>
            </View>


            <View style={{ flex: 1 }}>
              <View style={styles.boxContent}>

                <View style={{ alignItems: "flex-end", paddingVertical: 4 }}>
                  <View style={{}}>
                    <View style={{ flexDirection: "row", marginBottom: 2 }}>
                      <Text style={[styles.companyText, { textAlign: "left", width: 34 }]}>DC NO</Text>
                      <View style={styles.valueContainer}>
                        <Text style={styles.colon}>:</Text>
                        <Text style={styles.ValueText}>{docId}</Text>
                      </View>                  </View>
                    <View style={{ flexDirection: "row", marginBottom: 2, marginRight: 5 }}>
                      <Text style={[styles.companyText, { textAlign: "left" }]}>DC DATE</Text>
                      <View style={styles.valueContainer}>
                        <Text style={styles.colon}>:</Text>
                        <Text style={styles.ValueText}>{getDateFromDateTimeToDisplay(poDate)}</Text>
                      </View>
                    </View>








                  </View>
                </View>

              </View>
            </View>

          </View>



          <View style={{
            flexDirection: "row",
            backgroundColor: "#946A52",
            // marginTop: 6,
            padding: 3,
          }}>
            <Text style={[styles.th, { flex: 1 }]}>S.NO</Text>
            <Text style={[styles.th, { flex: 5 }]}>STYLE NO</Text>
            <Text style={[styles.th, { flex: 3 }]}>ITEM</Text>
            <Text style={[styles.th, { flex: 2 }]}>COLOR</Text>
            <Text style={[styles.th, { flex: 1 }]}>HSN</Text>

            <Text style={[styles.th, { flex: 1 }]}>UOM</Text>
            <Text style={[styles.th, { flex: 2 }]}>NO OF BOX</Text>
            <Text style={[styles.th, { flex: 2 }]}>QTY</Text>
          </View>

          {filledPoItems?.map((row, index) => (
            <View key={index} style={{
              flexDirection: "row",
              backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F4EEE9",
            }}>
              <Text style={[styles.td, { flex: 1 }]}>{index + 1}</Text>
              <Text style={[styles.td, { flex: 5, textAlign: "left" }]}>
                {row?.Style?.name}
              </Text>
              <Text style={[styles.td, { flex: 3, textAlign: "left" }]}>
                {row?.StyleItem?.name}
              </Text>
              <Text style={[styles.td, { flex: 2, textAlign: "left" }]}>
                {row?.Color?.name}
              </Text>
              <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>
                {row?.styleId ? 9988 : ""}
              </Text>


              <Text style={[styles.td, { flex: 1, textAlign: "left" }]}>
                {row?.Uom?.name}
              </Text>
              <Text style={[styles.td, { flex: 2, textAlign: "right" }]}>
                {row?.noOfBox ? (Number(row?.noOfBox)).toFixed(3) : ""}
              </Text>
              <Text style={[styles.td, { flex: 2, textAlign: "right" }]}>
                {row?.qty ? (Number(row?.qty)).toFixed(3) : ""}
              </Text>





            </View>
          ))}

          <View
            style={{
              flexDirection: "row",

            }}
          >
            {/* S.NO */}


            {/* NO OF BOX */}
            <Text
              style={[
                styles.td,
                {
                  flex: 13.8,
                  fontWeight: "bold",
                  textAlign: "right",
                  paddingRight: 14,
                },
              ]}
            >
              TOTAL
            </Text>

            {/* QTY */}
            <Text
              style={[
                styles.td,
                {
                  flex: 1.7,
                  textAlign: "right",
                  fontWeight: "bold",
                },
              ]}
            >
              {parseFloat(totalQty).toFixed(3)}
            </Text>
          </View>


          <View
            style={{
              flexDirection: "row",
            }}
          >
            {/* LEFT 70% */}
            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: BORDER_GREY,
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Thank You For Your Business
              </Text>
            </View>

            {/* RIGHT 30% */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                padding: 5,
              }}
            >
              <Image source={MsExports} style={styles.logo} />

              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: 20
                }}
              >
                AUTHORISED SIGNATORY
              </Text>
            </View>
          </View>

        </View>
        <View style={{
          marginTop: 20, textAlign: "center", fontSize: 8,

        }}>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>



      </Page>
    </Document >
  );
};

export default DeliveryChallanPrint;

