import streamlit as st
import requests

st.set_page_config(
    page_title="Bias Detector",
    layout="wide"
)

st.title("Bias Detector")

st.write(
    "Paste any article, job description, "
    "or statement to detect bias."
)

text = st.text_area(
    "Paste Text Here",
    height=250
)

if st.button("Analyze Bias"):

    if text.strip() == "":
        st.warning("Please enter text first.")

    else:

        try:

            response = requests.post(
                "http://127.0.0.1:8000/predict",
                json={"text": text}
            )

            result = response.json()

            st.success("Analysis Complete")

            col1, col2 = st.columns(2)

            with col1:
                st.subheader("Bias Type")

                if result["is_biased"]:
                    st.error("Biased")
                else:
                    st.success("Neutral")

                st.write(
                    f"Label: {result['label']}"
                )

            with col2:
                st.subheader("Confidence")

                st.metric(
                    "Score",
                    result["confidence"]
                )

        except Exception as e:
            st.error(
                "Backend connection failed."
            )
            st.write(e)
