'use client';

import React, { useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface GravityFormsFormAttributes {
  title?: boolean;
  description?: boolean;
  ajax?: boolean;
  formPreview?: boolean;
  imgPreview?: boolean;
  theme?: string;
  inputSize?: string;
  inputBorderRadius?: number;
  inputBorderColor?: string;
  inputBackgroundColor?: string;
  inputColor?: string;
  inputPrimaryColor?: string;
  inputImageChoiceAppearance?: string;
  inputImageChoiceStyle?: string;
  inputImageChoiceSize?: string;
  labelFontSize?: number;
  labelColor?: string;
  descriptionFontSize?: number;
  descriptionColor?: string;
  buttonPrimaryBackgroundColor?: string;
  buttonPrimaryColor?: string;
  formId?: string;
}

interface GravityFormsFormProps {
  name: string;
  attributes: GravityFormsFormAttributes;
  saveContent?: string | null;
}

interface NameInput {
  id: string;
  label: string;
  name?: string;
  autocompleteAttribute?: string;
  choices?: Array<{ text: string; value: string }>;
  isHidden?: boolean;
  inputType?: string;
}

interface FormField {
  id: number;
  label: string;
  type: string;
  isRequired: boolean;
  choices?: Array<{ text: string; value: string }>;
  description?: string;
  placeholder?: string;
  inputs?: NameInput[];
  nameFormat?: string;
}

interface GravityForm {
  id: number;
  title: string;
  description: string;
  fields: FormField[];
}

export default function GravityFormsForm({ name, attributes, saveContent }: GravityFormsFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formFields, setFormFields] = useState<GravityForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const formId = attributes.formId || '1';

  React.useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/gravity-forms/${formId}`);
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to fetch form:', data);
          let errorText = data.error || 'Failed to load form. Please check if Gravity Forms is installed and the REST API is enabled.';
          if (data.status === 401 || data.status === 403 || errorText.toLowerCase().includes('authentication')) {
            errorText = 'Authentication failed. Please check your Gravity Forms REST API credentials, permissions, and user role.';
          }
          setSubmitMessage({ type: 'error', text: errorText });
          setIsLoading(false);
          return;
        }

        setFormFields(data);
      } catch (error) {
        console.error('Error fetching form:', error);
        setSubmitMessage({
          type: 'error',
          text: 'Failed to load form. Please check if Gravity Forms is installed and the REST API is enabled.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      let recaptchaToken: string | undefined;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('form_submit');
        } catch (recaptchaError) {
          console.error('reCAPTCHA error:', recaptchaError);
        }
      }

      const response = await fetch(`/api/gravity-forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const result = await response.json();

      if (response.ok && result.is_valid) {
        setSubmitMessage({ type: 'success', text: result.confirmation_message || 'Form submitted successfully!' });
        setFormData({});
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.validation_messages ? Object.values(result.validation_messages).join(', ') : result.error || 'Form submission failed'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage({ type: 'error', text: 'An error occurred while submitting the form' });
    } finally {
      setIsSubmitting(false);
    }
  }, [executeRecaptcha, formData, formId]);

  const renderField = (field: FormField) => {
    const inputStyles: React.CSSProperties = {
      borderRadius: `${attributes.inputBorderRadius || 3}px`,
      borderColor: attributes.inputBorderColor || '#686e77',
      backgroundColor: attributes.inputBackgroundColor || '#fff',
      color: attributes.inputColor || '#112337',
      fontSize: attributes.inputSize === 'sm' ? '14px' : attributes.inputSize === 'lg' ? '18px' : '16px',
    };

    const labelStyles: React.CSSProperties = {
      fontSize: `${attributes.labelFontSize || 14}px`,
      color: attributes.labelColor || '#112337',
    };

    const descriptionStyles: React.CSSProperties = {
      fontSize: `${attributes.descriptionFontSize || 13}px`,
      color: attributes.descriptionColor || '#585e6a',
    };

    const commonClasses = 'w-full border px-3 py-2';

    switch (field.type) {
      case 'name':
        return (
          <div key={field.id} className="mb-4">
            <fieldset>
              <legend style={labelStyles} className="block mb-2 font-medium">
                {field.label}
                {field.isRequired && <span className="text-red-500 ml-1">*</span>}
              </legend>
              {field.description && <p style={descriptionStyles} className="mb-2">{field.description}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field.inputs?.filter(input => !input.isHidden).map((input) => {
                  const inputId = `input_${input.id}`;
                  const isSelect = input.inputType === 'radio' || input.choices;

                  return (
                    <div key={input.id}>
                      {isSelect ? (
                        <select
                          id={inputId}
                          name={inputId}
                          style={inputStyles}
                          className={commonClasses}
                          value={formData[inputId] || ''}
                          onChange={(e) => handleChange(inputId, e.target.value)}
                          required={field.isRequired}
                          aria-label={input.label}
                        >
                          <option value="">{input.label}</option>
                          {input.choices?.map((choice, idx) => (
                            <option key={idx} value={choice.value}>{choice.text}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          id={inputId}
                          name={inputId}
                          style={inputStyles}
                          className={commonClasses}
                          placeholder={input.label}
                          value={formData[inputId] || ''}
                          onChange={(e) => handleChange(inputId, e.target.value)}
                          required={field.isRequired}
                          autoComplete={input.autocompleteAttribute}
                          aria-label={input.label}
                        />
                      )}
                      <label
                        htmlFor={inputId}
                        style={{ fontSize: `${(attributes.descriptionFontSize || 13) - 1}px`, color: attributes.descriptionColor }}
                        className="block mt-1 text-xs"
                      >
                        {input.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>
        );

      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={`input_${field.id}`} style={labelStyles} className="block mb-2 font-medium">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && <p style={descriptionStyles} className="mb-2">{field.description}</p>}
            <input
              type={field.type}
              id={`input_${field.id}`}
              name={`input_${field.id}`}
              style={inputStyles}
              className={commonClasses}
              placeholder={field.placeholder}
              value={formData[`input_${field.id}`] || ''}
              onChange={(e) => handleChange(`input_${field.id}`, e.target.value)}
              required={field.isRequired}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={`input_${field.id}`} style={labelStyles} className="block mb-2 font-medium">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && <p style={descriptionStyles} className="mb-2">{field.description}</p>}
            <textarea
              id={`input_${field.id}`}
              name={`input_${field.id}`}
              style={inputStyles}
              className={`${commonClasses} min-h-[120px]`}
              placeholder={field.placeholder}
              value={formData[`input_${field.id}`] || ''}
              onChange={(e) => handleChange(`input_${field.id}`, e.target.value)}
              required={field.isRequired}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="mb-4">
            <label style={labelStyles} className="block mb-2 font-medium">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && <p style={descriptionStyles} className="mb-2">{field.description}</p>}
            <select
              style={inputStyles}
              className={commonClasses}
              value={formData[`input_${field.id}`] || ''}
              onChange={(e) => handleChange(`input_${field.id}`, e.target.value)}
              required={field.isRequired}
            >
              <option value="">Select...</option>
              {field.choices?.map((choice, idx) => (
                <option key={idx} value={choice.value}>{choice.text}</option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="mb-4">
            <label style={labelStyles} className="block mb-2 font-medium">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && <p style={descriptionStyles} className="mb-2">{field.description}</p>}
            {field.choices?.map((choice, idx) => (
              <label key={idx} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={`input_${field.id}`}
                  value={choice.value}
                  checked={formData[`input_${field.id}`] === choice.value}
                  onChange={(e) => handleChange(`input_${field.id}`, e.target.value)}
                  required={field.isRequired}
                  className="mr-2"
                  style={{ accentColor: attributes.inputPrimaryColor || '#F2685E' }}
                />
                <span style={{ color: attributes.inputColor }}>{choice.text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="mb-4">
            <label style={labelStyles} className="block mb-2 font-medium">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && <p style={descriptionStyles} className="mb-2">{field.description}</p>}
            {field.choices?.map((choice, idx) => (
              <label key={idx} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={choice.value}
                  checked={formData[`input_${field.id}`]?.includes(choice.value) || false}
                  onChange={(e) => {
                    const currentValues = formData[`input_${field.id}`] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, choice.value]
                      : currentValues.filter((v: string) => v !== choice.value);
                    handleChange(`input_${field.id}`, newValues);
                  }}
                  className="mr-2"
                  style={{ accentColor: attributes.inputPrimaryColor || '#F2685E' }}
                />
                <span style={{ color: attributes.inputColor }}>{choice.text}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading form...</div>;
  }

  if (!formFields) {
    return <div className="p-4 text-red-500">Failed to load form</div>;
  }

  const buttonStyles: React.CSSProperties = {
    backgroundColor: attributes.buttonPrimaryBackgroundColor || '#F2685E',
    color: attributes.buttonPrimaryColor || '#fff',
  };

  return (
    <div className="gravity-form-wrapper">
      {attributes.title && formFields.title && (
        <h2 className="text-2xl font-bold mb-4">{formFields.title}</h2>
      )}
      {attributes.description && formFields.description && (
        <p className="mb-6">{formFields.description}</p>
      )}

      <form onSubmit={handleSubmit} className="gravity-form">
        {formFields.fields.map(renderField)}

        {submitMessage && (
          <div className={`p-4 mb-4 rounded ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={buttonStyles}
          className="px-6 py-3 rounded font-medium hover:!bg-warm-coral hover:!text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {executeRecaptcha && (
          <p className="mt-4 text-xs text-gray-500">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Privacy Policy</a>{' '}
            and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Terms of Service</a>{' '}
            apply.
          </p>
        )}
      </form>
    </div>
  );
}
