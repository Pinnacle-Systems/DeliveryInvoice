

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
  src: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,600;1,400;1,600&display=swap",
});

const styles = StyleSheet.create({
  // page: {
  //   fontFamily: "Helvetica",
  //   fontSize: 8,
  //   padding: 10,
  //   border: "1 solid #000",
  // },
  borderBox: { border: "1 solid black", margin: 0, padding: 8, },
  page: {
    // fontFamily: "Helvetica",
    fontSize: 8,
    padding: 0,
    border: "1 solid #000",
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    // marginBottom: 7,
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: 1,
    height: 100


  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,

  },
  logo: {
    width: 80,
    height: 80,
    // marginRight: 6,
    resizeMode: 'contain',
    marginRight: 12,

  },
  companyText: {
    fontSize: 8,
    marginBottom: 1,
    textAlign: "left",
    marginRight: 4,
  },
  ValueText: {
    fontSize: 9,
    marginBottom: 1,
    paddingLeft: 4,   // gap before text starts
  }
  ,
  greenTitle: {
    textAlign: "center",
    fontSize: 15,
    color: "",
    backgroundColor: "#946A52",
    paddingVertical: 4,
    // borderBottom: "18 solid #1D3A76",

    fontWeight: "500",
    // marginVertical: 4,
    // textDecoration: "underline",
    // marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    border: "1 solid #000",
    justifyContent: "space-between",
    padding: 4,
  },
  infoLeft: { flex: 1 },
  infoRight: {
    width: 80,
    height: 80,
    border: "1 solid #000",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    // color: "#FFFF",
    // backgroundColor: "#e6ffe6",
    backgroundColor: "#946A52",
    padding: 6,
    marginBottom: 2
  },
  valueContainer: {
    flexDirection: 'row',
    paddingLeft: 6,   // GAP after label
  },

  colon: {
    fontSize: 9,
  },
  boxRow: {
    flexDirection: "row",
    border: "1 solid #000",
    marginTop: 4,
  },
  boxCol: {
    flex: 1,
    borderRight: "1 solid #000",
  },
  boxContent: {
    padding: 4,
    fontSize: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderTop: "1 solid #000",
    borderBottom: "1 solid #000",
    marginTop: 6,
    backgroundColor: "#946A52",
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
    flex: 1,
    fontSize: 8,
    textAlign: "center",
    borderRight: "1 solid #000",
    borderBottom: "1 solid #000",
    padding: 3,
  },
  totalRow: {
    flexDirection: "row",
    borderTop: "1 solid #000",
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
    border: "1 solid #000",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  taxHeader: {
    backgroundColor: "#d1fae5",
    borderBottom: "1 solid #000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 8,
    padding: 3,
  },
  taxRow: {
    flexDirection: "row",
    borderTop: "1 solid #000",
  },
  taxLabel: { flex: 1, padding: 3, fontSize: 8 },
  taxValue: {
    flex: 1,
    textAlign: "right",
    padding: 3,
    fontSize: 8,
  },
  remarksSection: {
    marginTop: 6,
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
  poDetails: {
    marginTop: 10,
    width: "50%", // adjust as needed
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  label: {
    fontSize: 8,
    fontWeight: "bold",
  },

  value: {
    fontSize: 8,
    textAlign: "right",
    flexShrink: 1, // helps long text wrap properly
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

  console.log(poItems, "poItems")


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


  // console.log(groupedPoItems, "groupedPoItems")


  // console.log(filledPoItems, "filledPoItems")


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
        <View style={styles.page}>
          <Text style={styles.greenTitle}>DELIVERY CHALLAN</Text>

          <View style={styles.header}>

            <View style={{
              fontSize: 10,
              // color: "#1D3A76",
              fontWeight: "bold",
              marginBottom: 2,
              marginTop: 1,
              flexDirection: 'row',
              width: '42%',
            }}>
              <Image source={MsExports} style={styles.logo} />
              <View style={{ width: 125, flexWrap: 'wrap' }}>

                <Text
                  style={{
                    fontSize: 16,
                    // fontWeight: "extrabold",
                    // paddingVertical: 3,
                    // paddingHorizontal: 6,
                    marginBottom: 4,
                    marginTop: 10,
                    textAlign: "left",
                    color: "#000000"

                  }}
                >
                  {branchData?.branchName}
                </Text>



                <Text style={{
                  fontSize: 8,
                  marginBottom: 1,
                  textAlign: "left",
                  marginRight: 1,
                  width: 160
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


            {/* <View style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#1D3A76",
                  fontWeight: "bold",
                  marginBottom: 4,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {branchData.branchName}
              </Text>
            </View> */}

            {/* <View >
              <View style={{ alignItems: "flex-end", marginTop: 15, marginBottom: 3 }}>
                <View style={{}}>
                  <View style={{ flexDirection: "row", marginBottom: 3 }}>
                    <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>DATE</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.colon}>:</Text>
                      <Text style={styles.ValueText}>{getDateFromDateTimeToDisplay(poDate)}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginBottom: 3 }}>
                    <Text style={[styles.companyText, { width: 120, textAlign: "left" }]}>DC NO</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.colon}>:</Text>
                      <Text style={styles.ValueText}>{docId}</Text>
                    </View>                  </View>






                </View>
              </View>




            </View> */}

          </View>
          <Text style={styles.sectionTitle}>Billing To :</Text>

          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginBottom: 6 }}>

            <View style={{ flex: 1 }}>
              <View style={styles.boxContent}>

                <View style={{
                  flexDirection: "row",

                }}>
                  <Text style={{
                    marginTop: 1
                  }} >M/s</Text>

                  <Text style={{
                    fontWeight: "bold",
                    paddingHorizontal: 2,
                    marginBottom: 4,
                    fontSize: 10
                  }}>
                    {supplierDetails?.name}
                  </Text>
                </View>



                <View style={{
                  paddingLeft: 7,
                  width: 200,
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


                <View style={{ flexDirection: "row", marginTop: 1, paddingLeft: 7, }}>
                  <Text style={[styles.companyText, { width: 40 }]}>Mobile No</Text>
                  <Text style={styles.companyText}>: {supplierDetails?.contactMobile ? supplierDetails?.contactMobile : "NA"}</Text>
                </View>


                <View style={{ flexDirection: "row", paddingLeft: 7, }}>
                  <Text style={[styles.companyText, { width: 40 }]}>GST No</Text>
                  <Text style={styles.companyText}>: {supplierDetails?.gstNo}</Text>
                </View>

                <View style={{ flexDirection: "row", paddingLeft: 7, }}>
                  <Text style={[styles.companyText, { width: 40 }]}>Email</Text>
                  <Text style={styles.companyText}>: {supplierDetails?.email}</Text>
                </View>
              </View>
            </View>


            <View style={{ flex: 1 }}>
              <View style={styles.boxContent}>
                <View >
                  <View style={{ alignItems: "flex-end", marginTop: 15, marginBottom: 3 }}>
                    <View style={{}}>
                      <View style={{ flexDirection: "row", marginBottom: 3, marginRight: 5 }}>
                        <Text style={[styles.companyText, { width: 100, textAlign: "left" }]}>DATE</Text>
                        <View style={styles.valueContainer}>
                          <Text style={styles.colon}>:</Text>
                          <Text style={styles.ValueText}>{getDateFromDateTimeToDisplay(poDate)}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: "row", marginBottom: 3 }}>
                        <Text style={[styles.companyText, { width: 100, textAlign: "left" }]}>DC NO</Text>
                        <View style={styles.valueContainer}>
                          <Text style={styles.colon}>:</Text>
                          <Text style={styles.ValueText}>{docId}</Text>
                        </View>                  </View>






                    </View>
                  </View>




                </View>







              </View>
            </View>

          </View>



          <View style={{
            flexDirection: "row",
            borderTop: "1 solid #000",
            borderBottom: "2 solid #000",
            backgroundColor: "#946A52",
            marginTop: 6,
            padding: 3,
          }}>
            <Text style={[styles.th, { flex: 1 }]}>S.No</Text>
            <Text style={[styles.th, { flex: 5 }]}>Style No</Text>
            <Text style={[styles.th, { flex: 3 }]}>Item</Text>
            <Text style={[styles.th, { flex: 2 }]}>Color</Text>
            <Text style={[styles.th, { flex: 1 }]}>Hsn</Text>

            <Text style={[styles.th, { flex: 1 }]}>Uom</Text>
            <Text style={[styles.th, { flex: 2 }]}>No Of Box</Text>
            <Text style={[styles.th, { flex: 2 }]}>Qty</Text>
          </View>

          {filledPoItems?.map((row, index) => (
            <View key={index} style={{ flexDirection: "row", borderBottom: "2 solid #d1d5db" }}>
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

          <View style={{
            flexDirection: "row", borderBottom: "2 solid #000",
          }}>
            <Text style={[{
              flex: 1, padding: 3,
            }]}></Text>

            <Text style={[{
              flex: 5, padding: 3,
            }]}>
            </Text>

            <Text style={[{
              flex: 3, padding: 3,
              fontSize: 11
            }]}>
              Total

            </Text>
            <Text style={[{
              flex: 2, padding: 3,
            }]}>
            </Text>
            <Text style={[{
              flex: 2, padding: 3,
            }]}>
            </Text>


            <Text style={[{
              flex: 2, borderRight: "1 solid #000", padding: 3,
            }]}>

            </Text>
            <Text style={[{
              flex: 2, textAlign: "right", fontSize: 8, borderRight: "1 solid #000", padding: 3,
            }]}>
              {parseFloat(totalQty).toFixed(3)}
            </Text>






          </View>



          {/* <View
            style={{
              alignSelf: "flex-end",
              border: "1 solid #9ca3af",
              // marginTop: 4,
              width: 180,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderTop: "1 solid #9ca3af",
                borderRight: "1 solid #9ca3af",
              }}
            >
              <Text style={{ flex: 2, fontSize: 8, padding: 3 }}>
                Taxable Amount
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: 8,
                  padding: 3,
                }}
              >
                {parseFloat(totalAmount).toFixed(3)}

              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderTop: "1 solid #9ca3af",
                borderRight: "1 solid #9ca3af",
              }}
            >
              <Text style={{ flex: 2, fontSize: 8, padding: 3 }}>
                CGST @{parseFloat(taxKey) / 2}%
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: 8,
                  padding: 3,
                }}
              >
                {parseFloat(cgstAmount).toFixed(3)}

              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderTop: "1 solid #9ca3af",
                borderRight: "1 solid #9ca3af",
              }}
            >
              <Text style={{ flex: 2, fontSize: 8, padding: 3 }}>
                SGST @{parseFloat(taxKey) / 2}%
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: 8,
                  padding: 3,
                }}
              >
                {parseFloat(sgstAmount).toFixed(3)}

              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderTop: "1 solid #9ca3af",
                borderRight: "1 solid #9ca3af",
              }}
            >
              <Text style={{ flex: 2, fontSize: 8, padding: 3 }}>
                IGST @%
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: 8,
                  padding: 3,
                }}
              >
                {parseFloat(igstAmount).toFixed(3)}

              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderTop: "1 solid #9ca3af",
                borderRight: "1 solid #9ca3af",
              }}
            >
              <Text style={{ flex: 2, fontSize: 8, padding: 3 }}>
                Round Off
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: 8,
                  padding: 3,
                }}
              >
                {roundOffAmount}

              </Text>
            </View>

            <View style={{ flexDirection: "row", borderTop: "1 solid #9ca3af", backgroundColor: "#946657", color: "#FFFF", padding: 2 }}>
              <Text style={{ flex: 1, fontSize: 10, paddingTop: 3 }}>Net Amount in Rs</Text>
              <Text style={{ flex: 1, textAlign: "right", fontSize: 10, padding: 3 }}>
                {parseFloat(roundedNetAmount).toFixed(3)}
              </Text>
            </View>
          </View> */}






















          <View style={{ marginTop: 100, justifyContent: "space-between", flexDirection: "row", padding: 5 }}>
            <Text
              style={{ fontSize: 8, textAlign: "right", fontWeight: "bold" }}
            >
              Party's Signature
            </Text>

            <Text
              style={{ fontSize: 8, textAlign: "right", fontWeight: "bold" }}
            >
              For {branchData.branchName}
            </Text>

          </View>

          {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
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
            </View> */}





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

